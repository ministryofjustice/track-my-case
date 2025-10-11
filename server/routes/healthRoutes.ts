import express from 'express'
import healthCheckController from '../controllers/health-controller'

export default function healthRoutes(app: express.Express): void {
  app.get('/health', healthCheckController)
  app.get('/healthz', (_req, res) => {
    res.status(200).send('🏥 Healthz - OK')
  })
}
