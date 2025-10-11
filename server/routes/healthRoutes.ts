import express from 'express'
import healthCheck from '../controllers/health-controller'

export default function healthRoutes(app: express.Express): void {
  app.get('/health', healthCheck)
  app.get('/healthz', (_req, res) => {
    res.status(200).send('🏥 Healthz - OK')
  })
}
