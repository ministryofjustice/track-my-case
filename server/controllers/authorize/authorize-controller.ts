// import * as openidClient from 'openid-client'
// import { Request, Response } from 'express'
// import { OneLoginConfig } from '../../one-login-config'
// import { getAuthorizeParameters } from '../../helpers/authorize-request'
// import { getPrivateKey } from '../../helpers/crypto'
// import { getDiscoveryMetadata } from '../../helpers/discovery-request'
// import { NextFunction } from 'express-serve-static-core'
//
// export const authorizeController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
//   verificationRequired: boolean,
// ): Promise<void> => {
  // try {
  //   const clientConfig = OneLoginConfig.getInstance()
  //   let privateKey: CryptoKey | null
  //   let clientSecret: string | null
  //
  //   if (clientConfig.getTokenAuthMethod() != 'client_secret_post') {
  //     privateKey = await getPrivateKey(clientConfig.getPrivateKey())
  //   } else {
  //     clientSecret = clientConfig.getClientSecret()
  //   }
  //
  //   let openidClientConfiguration: openidClient.Configuration = await getDiscoveryMetadata(
  //     clientConfig,
  //     privateKey,
  //     clientSecret,
  //   )
  //   const parameters = getAuthorizeParameters(clientConfig, res, verificationRequired)
  //   let redirectTo: URL
  //
  //   if (clientConfig.getRequireJAR()) {
  //     const issuer: string = clientConfig.getIssuer()
  //     let substituteAudience: openidClient.ModifyAssertionOptions = {
  //       [openidClient.modifyAssertion]: (header, _payload) => {
  //         _payload.aud = `${issuer}authorize`
  //       },
  //     }
  //     redirectTo = await openidClient.buildAuthorizationUrlWithJAR(
  //       openidClientConfiguration,
  //       parameters,
  //       privateKey,
  //       substituteAudience,
  //     )
  //     // Need to manually add response_type and scope to the query string because the openid-client library doesn't
  //     redirectTo.href = redirectTo.href + '&response_type=code&scope=openid'
  //   } else {
  //     redirectTo = openidClient.buildAuthorizationUrl(openidClientConfiguration, parameters)
  //   }
  //
  //   res.redirect(redirectTo.href)
  // } catch (error) {
  //   // Unexpected errors
  //   next(error)
  // }
// }
