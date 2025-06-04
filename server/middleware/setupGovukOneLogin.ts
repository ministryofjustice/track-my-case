import type { Request, Response, NextFunction, Router } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import { BaseClient, Client, generators } from 'openid-client'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import govukOneLogin from '../authentication/govukOneLogin'
import config from '../config'
import { logger } from '../logger'
import tokenStoreFactory from '../authentication/tokenStore/tokenStoreFactory'
import { OneLoginConfig } from '../one-login-config'
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

const clientConfig = OneLoginConfig.getInstance()

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

const handleLogout = (decodedToken: jwt.JwtPayload) => {
  const userId = decodedToken.sub
  logger.info(`Logging out user: ${userId}`)
  const tokenStore = tokenStoreFactory()
  tokenStore.removeToken(userId)
}

export default function setUpGovukOneLogin(): Router {
  govukOneLogin.init().then((client: BaseClient) => {
    router.use(passport.initialize())
    router.use(passport.session())
    router.use(flash())

    router.get(paths.AUTH_ERROR, (req: Request, res: Response) => {
      res.status(401)
      return res.render('pages/error', { user: req.user, error: 'error', error_description: 'error_description' })
    })

    // Endpoint to handle back-channel logout requests
    router.post('/backchannel-logout-uri', async (req, res) => {
      logger.info(`Backchannel logout notification received`)
      const logoutToken = req.body.logout_token
      try {
        // decode to find the signing key header (kid)
        const decodedToken = jwt.decode(logoutToken, { complete: true })
        if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
          throw new Error('Invalid token')
        }

        // verify the signature
        const oneLoginPublicKey = await getSigningKey(decodedToken.header.kid)
        const verifiedPayload = jwt.verify(logoutToken, oneLoginPublicKey as jwt.Secret) as jwt.JwtPayload

        handleLogout(verifiedPayload)
        res.status(200).send('Logout processed')
      } catch (error) {
        logger.error(`Invalid logout token ${JSON.stringify(req.body)}:`, error)
        res.status(400).send('Invalid logout token')
      }
    })

    router.get(paths.SIGN_IN, (req, res, next) => {
      passport.authenticate(config.apis.govukOneLogin.strategyName, { nonce: generators.nonce() })(req, res, next)
    })

    router.get(paths.AUTH_CALLBACK, (req, res, next) => {
      passport.authenticate(config.apis.govukOneLogin.strategyName, {
        nonce: generators.nonce(),
        successRedirect: clientConfig.getServiceUrl() + paths.SIGNED_IN,
        failureRedirect: clientConfig.getServiceUrl() + paths.AUTH_ERROR,
        failureFlash: true,
      })(req, res, next)
    })

    async function handleSignOut(req: Request, res: Response, next: NextFunction, redirectUri: string) {
      if (req.user) {
        try {
          const tokenStore = tokenStoreFactory()
          const tokenId = await tokenStore.getToken(req.user.token)
          return req.logout(err => {
            if (err) return next(err)
            return req.session.destroy(() =>
              res.redirect(
                client.endSessionUrl({
                  id_token_hint: tokenId,
                  post_logout_redirect_uri: redirectUri,
                }),
              ),
            )
          })
        } catch (err) {
          return next(err)
        }
      }
      return res.redirect(redirectUri)
    }

    router.use(paths.SIGN_OUT, async (req, res, next) => {
      const serviceUrl = clientConfig.getServiceUrl()
      return handleSignOut(req, res, next, serviceUrl)
    })

    router.use('/sign-out-timed', async (req, res, next) => {
      const serviceUrl = clientConfig.getServiceUrl()
      return handleSignOut(req, res, next, `${serviceUrl}/timed-out`)
    })

    router.use((req, res, next) => {
      res.locals.user = req.user
      res.locals.authUrl = config.apis.hmppsAuth.externalUrl

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

        if (res.locals.user.authSource === 'nomis') {
          // res.locals.user.staffId = parseInt(userId, 10) || undefined
        }
      }

      next()
    })

    router.use(govukOneLogin.authenticationMiddleware())
  })

  return router
}
