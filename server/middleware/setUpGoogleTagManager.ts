import express, { NextFunction, Request, Response, Router } from 'express'
import config from '../config'

export default function setUpGoogleTagManager(): Router {
  const router = express.Router()

  router.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.gtmId = config.analytics.gtmId
    res.locals.cookieAccepted = req.session.cookieAccepted
    next()
  })

  return router
}
