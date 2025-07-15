import express from 'express'

import { getCaseSelect, postCaseSelect } from '../controllers/case-selector-controller'
import caseDashboardController from '../controllers/case-dashboard-controller'
import courtInformationController from '../controllers/court-information-controller'

import courtInfoHealthCheck from '../controllers/court-info-controller'
import courtInformationTwoController from '../controllers/court-information-two-controller'

import asyncMiddleware from '../middleware/asyncMiddleware'
import paths from '../constants/paths'
import {
  getEnterUniqueReferenceNumber,
  postEnterUniqueReferenceNumber,
} from '../controllers/enter-unique-reference-number-controller'
import confirmCaseController from '../controllers/confirm-case-controller'

export default function routes(app: express.Express): void {
  // Page: Enter unique reference number (URN)
  // https://www.gov.uk/government/publications/common-platform-unique-reference-number-urn/purpose-of-the-urn-and-how-to-obtain-it
  app.get(paths.CASES.SEARCH, asyncMiddleware(getEnterUniqueReferenceNumber))
  app.post(paths.CASES.SEARCH, asyncMiddleware(postEnterUniqueReferenceNumber))

  // Page: Select your case
  app.get(paths.CASES.SELECT, asyncMiddleware(getCaseSelect))
  app.post(paths.CASES.SELECT, asyncMiddleware(postCaseSelect))

  // Page: Case dashboard
  app.get(
    paths.CASES.CONFIRM_CASE,
    asyncMiddleware((req, res, next) => {
      confirmCaseController(req, res, next)
    }),
  )

  // Page: Case dashboard
  app.get(
    paths.CASES.DASHBOARD,
    asyncMiddleware((req, res, next) => {
      caseDashboardController(req, res, next)
    }),
  )

  // TODO: add `:id` to route - View court information
  // INFO: This route is still to be used for prototype purposes
  app.get(
    paths.CASES.COURT_INFORMATION,
    asyncMiddleware((req, res, next) => {
      courtInformationController(req, res, next, 'pages/case/court-information')
    }),
  )

  // INFO: This route has been added for show & tell 29-Apr-2025
  // It breaks GDS principles and requires further discussion
  app.get(
    paths.CASES.COURT_INFORMATION_2,
    asyncMiddleware((req, res, next) => {
      courtInformationTwoController(req, res, next, 'pages/case/court-information-2')
    }),
  )

  // TODO: add `:id` to route - View contact details
  // TODO: need to verify if contact details should be linked to a case
  // TODO: need to determine if the contact details should be in a different module
  app.get(
    paths.CASES.CONTACT_DETAILS,
    asyncMiddleware((req, res, next) => {
      courtInformationController(req, res, next, 'pages/case/contact-details')
    }),
  )

  app.get(
    paths.CASES.COURT_INFO_HEALTH,
    asyncMiddleware((req, res, next) => {
      courtInfoHealthCheck(req, res, next)
    }),
  )
}
