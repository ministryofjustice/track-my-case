import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'

export function AuthenticatedUser(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect(paths.SIGN_IN)
  }
}
