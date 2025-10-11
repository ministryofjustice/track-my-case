import express from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import cookiesController from '../controllers/cookies-controller'
import cookiesAcceptRejectController from '../controllers/cookies-accept-reject-controller'

export default function cookiesRoutes(app: express.Express): void {
  app.get(
    '/cookies',
    asyncMiddleware((req, res, next) => {
      cookiesController(req, res, next)
    }),
  )

  app.post(
    '/cookies/decision',
    asyncMiddleware((req, res, next) => {
      cookiesAcceptRejectController(req, res, next)
    }),
  )
}
