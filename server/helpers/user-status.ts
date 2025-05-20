import { NextFunction, Request, Response } from 'express'

export function isAuthenticated(req: Request): boolean {
  return !!req.session.user?.userinfo?.email_verified
}

export function AuthenticatedUser(req: Request, res: Response, next: NextFunction) {
  if (isAuthenticated(req)) {
    next()
  } else {
    res.redirect('/oidc/login')
  }
}

export function isVerified(req: Request): boolean {
  return !!(req.session.user && req.session.user.coreidentity)
}

export function VerifiedUser(req: Request, res: Response, next: NextFunction) {
  if (isVerified(req) || req.session?.user?.returnCode) {
    next()
  } else {
    res.redirect('/oidc/verify')
  }
}
