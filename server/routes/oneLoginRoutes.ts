import express, { NextFunction, Request, Response } from 'express'
import { AuthenticatedUser } from '../helpers/authenticatedUser'
import asyncMiddleware from '../middleware/asyncMiddleware'
import paths from '../constants/paths'
import signedInController from '../controllers/signed-in-controller'
import signedOutController from '../controllers/signed-out-controller'
import accessDeniedController from '../controllers/access-denied-controller'

export default function oneLoginRoutes(app: express.Express): void {
  app.get(
    paths.ONE_LOGIN.SIGNED_IN,
    AuthenticatedUser,
    asyncMiddleware((req: Request, res: Response, next: NextFunction) => {
      signedInController(req, res, next)
    }),
  )

  app.get(
    paths.ONE_LOGIN.SIGNED_OUT,
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      signedOutController(req, res, next)
    }),
  )

  app.get(
    paths.ACCESS_DENIED,
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      accessDeniedController(req, res, next)
    }),
  )
}
