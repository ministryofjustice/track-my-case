import express from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import indexController from '../controllers/index-controller'

export default function indexRoutes(app: express.Express): void {
  app.get(
    '/',
    asyncMiddleware((req, res, next) => {
      indexController(req, res, next)
    }),
  )
}
