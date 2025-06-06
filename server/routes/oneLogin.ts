import express, { NextFunction, Request, Response } from 'express'
import { AuthenticatedUser } from '../helpers/authenticatedUser'
import { signedInController } from '../controllers/signed-in-controller'
import asyncMiddleware from '../middleware/asyncMiddleware'
import paths from '../constants/paths'

export default function routes(app: express.Express): void {
  app.get(
    paths.SIGNED_IN,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      signedInController(req, res, next)
    }),
  )

  app.get(
    paths.SIGNED_OUT,
    asyncMiddleware((req: Request, res: Response, next: NextFunction) => {
      res.render('pages/signed-out.njk', {
        serviceName: 'Track My Case',
      })
    }),
  )
}
