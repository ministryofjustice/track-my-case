import express from 'express'

export default function healthRoutes(app: express.Express): void {
  app.get('/healthz', (_req, res) => {
    res.status(200).send('OK')
  })
}
