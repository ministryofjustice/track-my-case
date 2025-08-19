import express from 'express'

import { getCaseSelect, postCaseSelect } from '../controllers/case-selector-controller'
import caseDashboardController from '../controllers/case-dashboard-controller'
import courtInformationControllerOld from '../controllers/court-information-controller-old'

import courtInfoHealthCheck from '../controllers/court-info-controller'
import courtInformationController from '../controllers/court-information-controller'

import asyncMiddleware from '../middleware/asyncMiddleware'
import paths from '../constants/paths'
import {
  getEnterUniqueReferenceNumber,
  postEnterUniqueReferenceNumber,
} from '../controllers/enter-unique-reference-number-controller'
import confirmCaseController from '../controllers/confirm-case-controller'
import { AuthenticatedUser } from '../helpers/authenticatedUser'

export default function routes(app: express.Express): void {
  // Page: Enter unique reference number (URN)
  // https://www.gov.uk/government/publications/common-platform-unique-reference-number-urn/purpose-of-the-urn-and-how-to-obtain-it
  app.get(paths.CASES.SEARCH, AuthenticatedUser, asyncMiddleware(getEnterUniqueReferenceNumber))
  app.post(paths.CASES.SEARCH, AuthenticatedUser, asyncMiddleware(postEnterUniqueReferenceNumber))

  // Page: Select your case
  app.get(paths.CASES.SELECT, AuthenticatedUser, asyncMiddleware(getCaseSelect))
  app.post(paths.CASES.SELECT, AuthenticatedUser, asyncMiddleware(postCaseSelect))

  // Page: Case dashboard
  app.get(
    paths.CASES.CONFIRM_CASE,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      confirmCaseController(req, res, next)
    }),
  )

  // Page: Case dashboard
  app.get(
    paths.CASES.DASHBOARD,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      caseDashboardController(req, res, next)
    }),
  )

  // TODO: add `:id` to route - View court information
  // INFO: This route is still to be used for prototype purposes
  app.get(
    paths.CASES.COURT_INFORMATION_OLD,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      courtInformationControllerOld(req, res, next, 'pages/case/court-information-old')
    }),
  )

  // INFO: This route has been added for show & tell 29-Apr-2025
  // It breaks GDS principles and requires further discussion
  app.get(
    paths.CASES.COURT_INFORMATION,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      courtInformationController(req, res, next, 'pages/case/court-information')
    }),
  )

  // TODO: add `:id` to route - View contact details
  // TODO: need to verify if contact details should be linked to a case
  // TODO: need to determine if the contact details should be in a different module
  app.get(
    paths.CASES.CONTACT_DETAILS,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      courtInformationControllerOld(req, res, next, 'pages/case/contact-details')
    }),
  )

  app.get(
    paths.CASES.COURT_INFO_HEALTH,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      courtInfoHealthCheck(req, res, next)
    }),
  )
}
