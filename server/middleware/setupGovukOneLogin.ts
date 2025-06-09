import type { NextFunction, Request, Response, Router } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import { BaseClient, EndSessionParameters, generators } from 'openid-client'
import jwt, { Jwt } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import govukOneLogin from '../authentication/govukOneLogin'
import config from '../config'
import { logger } from '../logger'
import tokenStoreFactory from '../authentication/tokenStore/tokenStoreFactory'
import paths from '../constants/paths'
import { jwtDecode } from 'jwt-decode'
import { convertToTitleCase } from '../utils/utils'

// Add property used in 'passport.authenticate(strategy, options, callback)'
// strategy options for 'oicd' that is missing from @types/passport
declare module 'passport' {
  interface AuthenticateOptions {
    nonce?: string
  }
}

const router = express.Router()

const signatureClient = jwksClient({
  jwksUri: config.apis.govukOneLogin.jwksUrl,
})

const getSigningKey = (kid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    signatureClient.getSigningKey(kid, (err: Error, key: jwksClient.SigningKey) => {
      if (err) {
        reject(err)
      } else {
        const signingKey = key.getPublicKey()
        resolve(signingKey)
      }
    })
  })
}

export const removeTokenOnLogout = async (userId?: string): Promise<void> => {
  logger.info(`Logging out user: ${userId}`)
  if (userId !== undefined) {
    const tokenStore = tokenStoreFactory()
    await tokenStore.removeToken(userId)
  }
}

const createUserIfExist = (user: Express.User): Express.User | undefined => {
  if (user) {
    return {
      authSource: 'onelogin',
      ...user,
    }
  }
  return undefined
}

export const decodeTokenAndClear = async (logoutToken: string): Promise<void> => {
  if (!logoutToken) {
    throw new Error('No logout_token provided')
  }

  // decode to find the signing key header (kid)
  const decodedToken: Jwt = jwt.decode(logoutToken, { complete: true })
  if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
    throw new Error('Invalid logout token ')
  }

  const oneLoginPublicKey = await getSigningKey(decodedToken.header.kid)
  try {
    // verify the signature
    const verifiedPayload = jwt.verify(logoutToken, oneLoginPublicKey as jwt.Secret) as jwt.JwtPayload
    logger.info('Token verified')

    await removeTokenOnLogout(verifiedPayload.sub)
  } catch (error) {
    logger.error(`Error on token verification ${error}`)
    await removeTokenOnLogout(decodedToken.payload.sub as string)
  }

  return Promise.resolve()
}

export const setUpGovukOneLogin = (): Router => {
  govukOneLogin.init().then((client: BaseClient) => {
    router.use(passport.initialize())
    router.use(passport.session())
    router.use(flash())

    router.get(paths.ONE_LOGIN.AUTH_ERROR, (req: Request, res: Response) => {
      res.status(401)
      return res.render('pages/error.njk', {
        user: req.user,
        error: 'error',
        error_description: 'error_description',
      })
    })

    // Endpoint to handle back-channel logout requests
    router.post(paths.ONE_LOGIN.BACK_CHANNEL_LOGOUT_URI, async (req: Request, res: Response) => {
      logger.info(`Back channel logout notification received`)
      try {
        const logoutToken = req.body?.logout_token
        await decodeTokenAndClear(logoutToken)

        res.status(200).send('Logout processed')
      } catch (error) {
        logger.error(`Invalid logout token ${JSON.stringify(req.body)}:`, error)
        res.status(400).send('Invalid logout token')
      }
    })

    router.get(paths.PASSPORT.SIGN_IN, (req, res, next) => {
      passport.authenticate(config.apis.govukOneLogin.strategyName, {
        nonce: generators.nonce(),
      })(req, res, next)
    })

    router.get(paths.PASSPORT.AUTH_CALLBACK, (req, res, next) => {
      passport.authenticate(config.apis.govukOneLogin.strategyName, {
        nonce: generators.nonce(),
        successRedirect: config.serviceUrl + paths.ONE_LOGIN.SIGNED_IN,
        failureRedirect: config.serviceUrl + paths.ONE_LOGIN.AUTH_ERROR,
        failureFlash: true,
      })(req, res, next)
    })

    async function handleSignOut(req: Request, res: Response, next: NextFunction, redirectUri: string) {
      if (req.user) {
        try {
          const tokenStore = tokenStoreFactory()
          const tokenId = await tokenStore.getToken(req.user.sub)
          return req.logout(err => {
            if (err) {
              return next(err)
            }
            // OneLogin documentation https://docs.sign-in.service.gov.uk/integrate-with-integration-environment/managing-your-users-sessions/#request-logout-notifications-from-gov-uk-one-login
            return req.session.destroy(() => {
              const endSessionUrl = client.endSessionUrl({
                id_token_hint: tokenId,
                post_logout_redirect_uri: redirectUri,
              } as EndSessionParameters)
              return res.redirect(endSessionUrl)
            })
          })
        } catch (err) {
          return next(err)
        }
      }
      return res.redirect(redirectUri)
    }

    router.use(paths.PASSPORT.SIGN_OUT, async (req, res, next) => {
      const postLogoutRedirectUrl = config.apis.govukOneLogin.postLogoutRedirectUrl
      return handleSignOut(req, res, next, postLogoutRedirectUrl)
    })

    router.use((req, res, next) => {
      res.locals.user = createUserIfExist(req.user)

      if (res.locals.user?.token) {
        const {
          name,
          user_id: userId,
          authorities: roles = [],
        } = jwtDecode(res.locals?.user?.token) as {
          name?: string
          user_id?: string
          authorities?: string[]
        }

        res.locals.user = {
          ...res.locals.user,
          userId,
          name,
          displayName: convertToTitleCase(name),
          userRoles: roles.map(role => role.substring(role.indexOf('_') + 1)),
        } as Express.User
      }

      next()
    })
  })

  return router
}
