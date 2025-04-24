// server/routes/case.ts
import { Router, type RequestHandler } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(): Router {
  const router = Router()

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  // Page: Select your case
  get('/case/select', async (req, res) => {
    res.render('pages/case/select.njk', {
      pageTitle: 'Select your case',
      radioItems: [
        { value: '1110987654321', text: 'CRN 1110987654321 (Burglary)' },
        { value: '1234567891011', text: 'CRN 1234567891011 (Assault)' },
      ],
    })
  })

  // Page: Case dashboard
  get('/case/dashboard', async (req, res) => {
    res.render('pages/case/dashboard.njk', {
      pageTitle: 'Your case dashboard',
    })
  })

  return router
}
