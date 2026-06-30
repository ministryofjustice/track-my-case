import express, { NextFunction, Request, Response, Router } from 'express'
import { logger } from '../logger'

export default function setUpReqUrlParser(): Router {
  const router = express.Router()

  router.use((req: Request, res: Response, next: NextFunction) => {
    const { originalUrl } = req
    const originalPath: string = originalUrl.split('?')[0]
    const normalised: string = originalPath.toLowerCase().replace(/\/{2,}/g, '/')

    if (originalPath !== normalised) {
      const redirectUrl: string = normalised + req.url.slice(req.path.length)
      try {
        const parsed = new URL(redirectUrl, `${req.protocol}://${req.hostname}`)
        const safeUrl: string = parsed.pathname + parsed.search
        logger.info('Request URL redirected', originalUrl, safeUrl)
        return res.redirect(301, safeUrl)
      } catch {
        return next()
      }
    }

    return next()
  })

  return router
}
