import express, { NextFunction, Request, Response, Router } from 'express'
import { logger } from '../logger'

export default function setUpReqUrlParser(): Router {
  const router = express.Router()

  router.use((req: Request, res: Response, next: NextFunction) => {
    const originalPath: string = req.originalUrl.split('?')[0]
    const normalised = originalPath.toLowerCase().replace(/\/{2,}/g, '/')

    if (originalPath !== normalised) {
      const redirectUrl: string = normalised + req.url.slice(req.path.length)
      logger.info('Request URL redirected', req.originalUrl, redirectUrl)
      return res.redirect(301, redirectUrl)
    }

    return next()
  })

  return router
}
