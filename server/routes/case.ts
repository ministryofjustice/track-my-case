import express from 'express'
import caseSelectorController from '../controllers/caseSelectorController'
import { caseDashboardController } from '../controllers/case-dashboard-controller'
import { courtInformationController } from '../controllers/court-information-controller'

import courtInfoHealthCheck from '../controllers/courtInfoController'
import courtInformationTwoController from '../controllers/court-information-two-controller'

import { AuthenticatedUser } from '../helpers/authenticatedUser'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(app: express.Express): void {
  // Page: Select your case
  app.get(
    '/case/select',
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      caseSelectorController(req, res, next)
    }),
  )
  app.post(
    '/case/select',
    AuthenticatedUser,
    asyncMiddleware(async (req, res, next) => {
      const { selectedCrn } = req.body

      if (!selectedCrn) {
        return res.status(400).render('pages/case/select', {
          radioItems: [], // you’ll need to pass the same `radioItems` again
          errorMessage: 'You must select a case',
          csrfToken: req.csrfToken(),
        })
      }

      // TODO: Save selection in session or do something useful with it
      // req.session.selectedCrn = selectedCrn

      // Redirect somewhere relevant
      return res.redirect('/case/dashboard')
    }),
  )

  // Page: Case dashboard
  app.get(
    '/case/dashboard',
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      caseDashboardController(req, res, next)
    }),
  )

  // TODO: add `:id` to route - View court information
  // INFO: This route is still to be used for prototype purposes
  app.get(
    '/case/court-information',
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      courtInformationController(req, res, next, 'pages/case/court-information')
    }),
  )

  // INFO: This route has been added for show & tell 29-Apr-2025
  // It breaks GDS principles and requires further discussion
  app.get(
    '/case/court-information-2',
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      courtInformationTwoController(req, res, next, 'pages/case/court-information-2')
    }),
  )

  // TODO: add `:id` to route - View contact details
  // TODO: need to verify if contact details should be linked to a case
  // TODO: need to determine if the contact details should be in a different module
  app.get(
    '/case/contact-details',
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      courtInformationController(req, res, next, 'pages/case/contact-details')
    }),
  )

  app.get(
    '/case/court-info-health',
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      courtInfoHealthCheck(req, res, next)
    }),
  )
}
