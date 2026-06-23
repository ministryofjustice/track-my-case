import express, { NextFunction, Request, Response, Router } from 'express'
import config from '../config'
import { encryptValue } from '../utils/utils'
import { COOKIES_PREFERENCES_SET } from '../constants/cookiesUtils'

export default function setUpGoogleTagManager(sessionSecret: string): Router {
  const router = express.Router()

  router.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.gtmId = config.analytics.gtmId
    res.locals.gtagId = config.analytics.gtagId
    res.locals.cookieAccepted = req.signedCookies?.[COOKIES_PREFERENCES_SET]
    res.locals.userId = encryptValue(req.session.passport?.user?.sub, sessionSecret)
    res.locals.sessionId = encryptValue(req.sessionID, sessionSecret)
    next()
  })

  return router
}
