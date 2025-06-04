import { NextFunction, Request, Response } from 'express'
import config from '../config'
import paths from '../constants/paths'

const initialiseBasicAuthentication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.locals.serviceName = 'Track My Case'
  res.locals.user = req.session.passport?.user
  res.locals.authenticated = req.isAuthenticated()
  res.locals.identitySupported = config.apis.govukOneLogin.identitySupported
  res.locals.oneLoginLink =
    config.nodeEnv === 'development' ? 'https://home.integration.account.gov.uk/' : 'https://home.account.gov.uk/'
  res.locals.signOutLink = config.serviceUrl + paths.SIGN_OUT
  res.locals.serviceUrl = config.serviceUrl
  res.locals.homepageLink = config.serviceUrl
}

export { initialiseBasicAuthentication }
