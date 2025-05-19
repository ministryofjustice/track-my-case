import express, { NextFunction, Request, Response } from 'express'
import { OneLoginConfig } from '../one-login-config'
import { AuthenticatedUser, isAuthenticated } from '../helpers/user-status'
import { authorizeController } from '../controllers/authorize/authorize-controller'
import { callbackController } from '../controllers/callback/callback-controller'
import { logoutController } from '../controllers/logout/logout-controller'
import { signedInController } from '../controllers/signed-in-controller'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(app: express.Express): void {
  const clientConfig = OneLoginConfig.getInstance()

  app.get(
    '/oidc/login',
    asyncMiddleware((req: Request, res: Response, next: NextFunction) => authorizeController(req, res, next, false)),
  )

  app.get(
    '/oidc/verify',
    asyncMiddleware((req: Request, res: Response, next: NextFunction) => authorizeController(req, res, next, true)),
  )

  app.get(
    '/oidc/authorization-code/callback',
    asyncMiddleware((req: Request, res: Response, next: NextFunction) => callbackController(req, res, next)),
  )

  app.get(
    '/signed-in',
    AuthenticatedUser,
    asyncMiddleware((req: Request, res: Response, next: NextFunction) => {
      signedInController(req, res, next)
    }),
  )

  app.get(
    '/oidc/logout',
    asyncMiddleware((req: Request, res: Response, next: NextFunction) => {
      logoutController(req, res, next)
    }),
  )

  // app.get("/landing-page", (req: Request, res: Response, next: NextFunction) => {
  //   // set flag to say user came via post office landing page
  //   res.cookie("post-office", true, {
  //     httpOnly: true,
  //   });
  //   authorizeController(req, res, next, false)
  // });

  app.get(
    '/signed-out',
    asyncMiddleware((req: Request, res: Response, next: NextFunction) => {
      res.render('pages/signed-out.njk', {
        serviceName: 'Track My Case',
      })
    }),
  )
}
