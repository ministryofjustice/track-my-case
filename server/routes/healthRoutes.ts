import express, { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import asyncMiddleware from '../middleware/asyncMiddleware'
import healthCheckController from '../controllers/health-controller'

export default function healthRoutes(app: express.Express): void {
  app.get(
    paths.HEALTHZ,
    asyncMiddleware((req: Request, res: Response, next: NextFunction): void => {
      healthCheckController(req, res, next)
    }),
  )
}
