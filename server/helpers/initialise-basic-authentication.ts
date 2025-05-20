import { NextFunction, Request, Response } from 'express'
import { OneLoginConfig } from '../one-login-config'
import { isAuthenticated, isVerified } from './user-status'

const clientConfig = OneLoginConfig.getInstance()

const initialiseBasicAuthentication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.locals.serviceName = 'Track My Case'
  res.locals.user = req.session.user
  res.locals.authenticated = isAuthenticated(req)
  res.locals.verified = isVerified(req)
  res.locals.identitySupported = clientConfig.getIdentitySupported()
  res.locals.oneLoginLink =
    clientConfig.getNodeEnv() === 'development'
      ? 'https://home.integration.account.gov.uk/'
      : 'https://home.account.gov.uk/'
  res.locals.signOutLink = clientConfig.getSignOutLink()
  res.locals.serviceUrl = clientConfig.getServiceUrl()
  res.locals.homepageLink = clientConfig.getServiceUrl()
}

export { initialiseBasicAuthentication }
