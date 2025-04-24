import { Router, type RequestHandler } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(): Router {
  const router = Router()

  // Wrap all routes in async error handler
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    res.render('pages/index', {
      currentTime: new Date().toISOString(),
    })
  })

  return router
}
