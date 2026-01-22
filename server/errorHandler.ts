import type { NextFunction, Request, Response } from 'express'
import type { HTTPError } from 'superagent'
import { logger } from './logger'
import config from './config'
import paths from './constants/paths'

export default function createErrorHandler(production: boolean) {
  return (error: HTTPError | Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for: ${req.originalUrl}`, error)

    // Handle the specific OIDC callback error when session is lost (e.g., after redeployment)
    if (
      error.message?.includes('did not find expected authorization request details in session') &&
      req.originalUrl?.includes('/oidc/authorization-code/callback')
    ) {
      logger.warn(
        `OIDC callback failed: session lost (likely due to server restart). Redirecting to sign-in. Request ID: ${req.id}`,
      )
      return res.redirect(config.serviceUrl + paths.PASSPORT.SIGN_IN)
    }

    const httpError: HTTPError = error as HTTPError
    if (httpError.status === 401 || httpError.status === 403) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    res.locals.message = production
      ? 'Something went wrong. The error has been logged. Please try again'
      : error.message
    res.locals.status = httpError.status
    res.locals.stack = production ? null : error.stack

    res.status(httpError.status || 500)

    return res.render('pages/error')
  }
}
