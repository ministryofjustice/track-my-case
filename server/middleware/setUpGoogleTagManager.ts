import express, { NextFunction, Request, Response, Router } from 'express'
import config from '../config'
import { encryptValue } from '../utils/utils'

export default function setUpGoogleTagManager(): Router {
  const router = express.Router()

  router.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.gtmId = config.analytics.gtmId
    res.locals.gtagId = config.analytics.gtagId
    res.locals.cookieAccepted = req.signedCookies?.cookies_preferences_set
    res.locals.userId = encryptValue(req.session.passport?.user?.email, config.session.secret)
    next()
  })

  return router
}
