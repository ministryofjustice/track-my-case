import express from 'express'
import { register } from '../services/prometheusService'

export default function prometheusRoutes(app: express.Express): void {
  // Metrics endpoint for Prometheus scraping
  // This endpoint should be accessible without authentication
  app.get('/prometheus', async (_req, res) => {
    try {
      res.set('Content-Type', register.contentType)
      const metrics = await register.metrics()
      res.end(metrics)
    } catch (e) {
      res.status(500).end('Error calling /prometheus')
    }
  })
}
