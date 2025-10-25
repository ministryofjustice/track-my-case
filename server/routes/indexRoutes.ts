import express from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import indexController from '../controllers/index-controller'
import paths from '../constants/paths'
import aboutTheServiceController from '../controllers/about-the-service-controller'

export default function indexRoutes(app: express.Express): void {
  app.get(
    '/',
    asyncMiddleware((req, res, next) => {
      indexController(req, res, next)
    }),
  )

  app.get(
    paths.ABOUT_THE_SERVICE,
    asyncMiddleware((req, res, next) => {
      aboutTheServiceController(req, res, next)
    }),
  )
}
