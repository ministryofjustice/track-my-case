import express, { NextFunction, Request, Response, Router } from 'express'
import { logger } from '../logger'

export default function setUpReqUrlParser(): Router {
  const router = express.Router()

  router.use((req: Request, res: Response, next: NextFunction) => {
    const originalUrl = req.url
    const [path, query] = originalUrl.split('?', 2)
    if (path?.startsWith('/assets')) {
      next()
    }
    if (path?.indexOf('//') > -1) {
      const normalizedPath = path.replace(/\/{2,}/g, '/')
      const replacedUrl = query ? `${normalizedPath}?${query}` : normalizedPath
      logger.info('Request URL parsed', originalUrl, replacedUrl)
      req.url = replacedUrl
    }

    next()
  })
  return router
}
