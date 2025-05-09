import { Router, type RequestHandler } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(): Router {
  const router = Router()

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  // Page: Select your case
  get('/case/select', async (req, res) => {
    res.render('pages/case/select.njk', {
      pageTitle: 'Select your case',
      resultData: req.session.user || {},
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
      resultData: req.session.user || {}
    })
  })

  // TODO: add `:id` to route - View court information
  // INFO: This route is still to be used for prototype purposes
  get('/case/court-information', async (_req, res) => {
    res.render('pages/case/court-information')
  })

  // INFO: This route has been added for show & tell 29-Apr-2025
  // It breaks GDS principles and requires further discussion
  get('/case/court-information-2', async (_req, res) => {
    res.render('pages/case/court-information-2')
  })
  // TODO: add `:id` to route - View contact details
  // TODO: need to verify if contact details should be linked to a case
  // TODO: need to determine if the contact details should be in a different module
  get('/case/contact-details', async (_req, res) => {
    res.render('pages/case/contact-details')
  })

  return router
}
