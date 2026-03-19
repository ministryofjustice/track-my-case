import { NextFunction, Request, Response } from 'express'
import govukOneLogin from '../authentication/govukOneLogin'
import paths from '../constants/paths'
import { hasCorrectPasswordAndNotExpired } from '../utils/utils'
import { getSafeReturnPath } from '../utils/safeReturnPath'

export const AuthenticatedUser = (req: Request, res: Response, next: NextFunction) => {
  return govukOneLogin.authenticationMiddleware(req, res, next)
}

/**
 * Middleware that requires the user to have entered the service password (session.passwordCorrect === true).
 * If not, redirects to the enter-password page (and stores returnTo so we can redirect back after).
 * Use for all case routes except /case/search and /case/court-information (which use AuthenticatedUser).
 */
export const PasswordAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (hasCorrectPasswordAndNotExpired(req, res)) {
    return next()
  }
  req.session.returnTo = getSafeReturnPath(req.originalUrl, paths.CASES.DASHBOARD)
  return res.redirect(paths.PRIVATE_BETA_SIGN_IN)
}
