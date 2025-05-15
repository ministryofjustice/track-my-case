import express, { NextFunction, Request, Response } from 'express'
import { OneLoginConfig } from '../one-login-config'
import { AuthenticatedUser, isAuthenticated } from '../helpers/user-status'
import { authorizeController } from '../controllers/authorize/authorize-controller'
import { callbackController } from '../controllers/callback/callback-controller'
import { logoutController } from '../controllers/logout/logout-controller'
import { signedInController } from '../controllers/signed-in-controller'

export default function routes(app: express.Express): void {
  const clientConfig = OneLoginConfig.getInstance()

  app.get('/oidc/login', (req: Request, res: Response, next: NextFunction) =>
    authorizeController(req, res, next, false),
  )

  app.get('/oidc/verify', (req: Request, res: Response, next: NextFunction) =>
    authorizeController(req, res, next, true),
  )

  app.get('/oidc/authorization-code/callback', (req: Request, res: Response, next: NextFunction) =>
    callbackController(req, res, next),
  )

  app.get('/signed-in', AuthenticatedUser, (req: Request, res: Response, next: NextFunction) => {
    signedInController(req, res, next)
  })

  // Page: Select your case
  app.get('/oidc/logout', (req: Request, res: Response, next: NextFunction) => logoutController(req, res, next))

  // app.get("/landing-page", (req: Request, res: Response, next: NextFunction) => {
  //   // set flag to say user came via post office landing page
  //   res.cookie("post-office", true, {
  //     httpOnly: true,
  //   });
  //   authorizeController(req, res, next, false)
  // });

  app.get('/signed-out', (req: Request, res: Response) => {
    res.render('pages/signed-out.njk', {
      serviceName: 'Track My Case',
    })
  })
}
