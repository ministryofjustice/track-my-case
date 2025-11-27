import express from 'express'
import paths from '../constants/paths'

export default function healthRoutes(app: express.Express): void {
  app.get(paths.HEALTHZ, (_req, res) => {
    res.sendStatus(200)
  })
}
