import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import indexController from '../controllers/index-controller'

export default function routes(): Router {
  const router = Router()

  // Wrap all routes in async error handler
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get(
    '/',
    asyncMiddleware((req, res, next) => {
      indexController(req, res, next)
    }),
  )

  return router
}
