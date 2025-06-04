import passport from 'passport'
import { Client, Issuer, Strategy, StrategyVerifyCallbackUserInfo, UserinfoResponse } from 'openid-client'

import { RequestHandler } from 'express'
import { createPrivateKey } from 'crypto'

import config from '../config'
import { logger } from '../logger'
import tokenStoreFactory from './tokenStore/tokenStoreFactory'
import paths from '../constants/paths'

passport.serializeUser((user: Express.User, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user: Express.User, done) => {
  // Not used but required for Passport
  done(null, user)
})

const authenticationMiddleware = (): RequestHandler => {
  return async (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }

    req.session.returnTo = req.originalUrl === paths.START ? paths.HOME : req.originalUrl
    return res.redirect(paths.SIGN_IN)
  }
}

async function init(): Promise<Client> {
  const discoveryEndpoint = `${config.apis.govukOneLogin.url}/.well-known/openid-configuration`

  const issuer = await Issuer.discover(discoveryEndpoint)
  logger.info(`GOV.UK One Login issuer discovered: ${issuer.metadata.issuer}`)

  // convert private key in PEM format to JWK
  const privateKey = config.apis.govukOneLogin.privateKey

  const privateKeyJwk = createPrivateKey({
    key: Buffer.from(privateKey, 'base64'),
    format: 'der',
    type: 'pkcs8',
  }).export({ format: 'jwk' })

  const clientId = config.apis.govukOneLogin.clientId
  const serviceUrl = config.serviceUrl
  const redirectUris = [`${serviceUrl}${paths.AUTH_CALLBACK}`]
  const client = new issuer.Client(
    {
      client_id: clientId,
      redirect_uris: redirectUris,
      response_types: ['code'],
      token_endpoint_auth_method: 'private_key_jwt',
      token_endpoint_auth_signing_alg: 'RS256',
      id_token_signed_response_alg: 'ES256',
    },
    { keys: [privateKeyJwk] },
  )

  const verify: StrategyVerifyCallbackUserInfo<UserinfoResponse> = (tokenSet, userInfo, done) => {
    logger.info(`GOV.UK One Login user verified, sub: ${userInfo.sub}`)

    const tokenStore = tokenStoreFactory()
    tokenStore.setToken(encodeURIComponent(userInfo.sub), tokenSet.id_token, config.session.expiryMinutes * 60)
    return done(null, userInfo)
  }

  const strategy = new Strategy(
    {
      client,
      params: {
        scope: config.apis.govukOneLogin.scopes,
        vtr: '["' + config.apis.govukOneLogin.authenticationVtr + '"]',
        ui_locales: config.apis.govukOneLogin.uiLocales,
      },
      usePKCE: false,
      extras: {
        clientAssertionPayload: {
          aud: [...new Set([issuer.issuer, issuer.token_endpoint, issuer.metadata.token_endpoint].filter(Boolean))],
        },
      },
    },
    verify,
  )

  passport.use(config.apis.govukOneLogin.strategyName, strategy)

  return client
}

export default {
  authenticationMiddleware,
  init,
}
