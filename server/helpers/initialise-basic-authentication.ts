/* eslint-disable import/prefer-default-export */
import { NextFunction, Request, Response } from 'express'
import config from '../config'
import { isAuthenticatedRequest } from '../utils/utils'
import paths from '../constants/paths'

const initialiseBasicAuthentication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.locals.user = req.session.passport?.user
  res.locals.authenticated = isAuthenticatedRequest(req)
  res.locals.identitySupported = config.apis.govukOneLogin.identitySupported
  res.locals.oneLoginLink = config.apis.govukOneLogin.oneLoginLink
  res.locals.signOutLink = config.serviceUrl + paths.PASSPORT.SIGN_OUT
  res.locals.serviceUrl = config.serviceUrl
  res.locals.homepageLink = config.serviceUrl
  res.locals.allowDebug = config.session.allowDebug && Boolean(req.query?.debug === 'true')
}

export { initialiseBasicAuthentication }
