import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { caseSelectController } from '../controllers/case-select-controller'
import { caseDashboardController } from '../controllers/case-dashboard-controller'
import { courtInformationController } from '../controllers/court-information-controller'

import courtInfoHealthCheck from '../controllers/courtInfoController'
import renderCourtInformation from '../controllers/courtHearingController'

export default function routes(): Router {
  const router = Router()

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  // Page: Select your case
  get('/case/select', async (req, res, next) => {
    caseSelectController(req, res, next)
  })

  // Page: Case dashboard
  get('/case/dashboard', async (req, res, next) => {
    caseDashboardController(req, res, next)
  })

  // TODO: add `:id` to route - View court information
  // INFO: This route is still to be used for prototype purposes
  get('/case/court-information', async (req, res, next) => {
    courtInformationController(req, res, next, 'pages/case/court-information')
  })

  // INFO: This route has been added for show & tell 29-Apr-2025
  // It breaks GDS principles and requires further discussion
  get('/case/court-information-2', async (req, res, next) => {
    courtInformationController(req, res, next, 'pages/case/court-information-2')
  })

  // TODO: add `:id` to route - View contact details
  // TODO: need to verify if contact details should be linked to a case
  // TODO: need to determine if the contact details should be in a different module
  get('/case/contact-details', async (req, res, next) => {
    courtInformationController(req, res, next, 'pages/case/contact-details')
  })

  get('/case/court-info-health', courtInfoHealthCheck)
  return router
}
