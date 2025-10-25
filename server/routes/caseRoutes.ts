import express from 'express'

import caseDashboardController from '../controllers/case-dashboard-controller'

import backEndApiHealth from '../controllers/back-end-api-health-controller'
import courtInformationController from '../controllers/court-information-controller'

import asyncMiddleware from '../middleware/asyncMiddleware'
import paths from '../constants/paths'
import {
  getEnterUniqueReferenceNumber,
  postEnterUniqueReferenceNumber,
} from '../controllers/enter-unique-reference-number-controller'
import { AuthenticatedUser } from '../helpers/authenticatedUser'
import supportGuidanceController from '../controllers/support-guidance-controller'
import supportRolesController from '../controllers/support-roles-controller'
import victimsCodeController from '../controllers/victims-code-controller'
import returnPropertyController from '../controllers/return-property-controller'
import understandCompensationController from '../controllers/understand-compensation-controller'
import victimsJourneyController from '../controllers/victims-journey-controller'
import victimPersonalStatementController from '../controllers/victim-personal-statement-controller'
import victimSupportLinksController from '../controllers/victim-support-links-controller'
import witnessServiceController from '../controllers/witness-service-controller'

export default function caseRoutes(app: express.Express): void {
  // Page: Enter your unique reference number
  // https://www.gov.uk/government/publications/common-platform-unique-reference-number-urn/purpose-of-the-urn-and-how-to-obtain-it
  app.get(paths.CASES.SEARCH, AuthenticatedUser, asyncMiddleware(getEnterUniqueReferenceNumber))
  app.post(paths.CASES.SEARCH, AuthenticatedUser, asyncMiddleware(postEnterUniqueReferenceNumber))

  // Page: Case dashboard
  app.get(
    paths.CASES.DASHBOARD,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      caseDashboardController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.COURT_INFORMATION,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      courtInformationController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.BACK_END_API_HEALTH,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      backEndApiHealth(req, res, next)
    }),
  )

  app.get(
    paths.CASES.SUPPORT_GUIDANCE,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      supportGuidanceController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.SUPPORT_ROLES,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      supportRolesController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.VICTIMS_JOURNEY,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      victimsJourneyController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.VICTIMS_CODE,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      victimsCodeController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.RETURN_PROPERTY,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      returnPropertyController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.UNDERSTAND_COMPENSATION,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      understandCompensationController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.VICTIM_PERSONAL_STATEMENT,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      victimPersonalStatementController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.VICTIM_SUPPORT_LINKS,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      victimSupportLinksController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.WITNESS_SERVICE,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      witnessServiceController(req, res, next)
    }),
  )
}
