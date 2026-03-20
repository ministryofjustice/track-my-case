import express from 'express'

import caseDashboardController from '../controllers/case-dashboard-controller'
import courtInformationController from '../controllers/court-information-controller'

import asyncMiddleware from '../middleware/asyncMiddleware'
import paths from '../constants/paths'
import {
  getEnterUniqueReferenceNumber,
  postEnterUniqueReferenceNumber,
} from '../controllers/enter-unique-reference-number-controller'
import { AuthenticatedUser, PasswordAuthenticated } from '../helpers/authenticatedUser'
import victimsCodeController from '../controllers/victims-code-controller'
import returnPropertyController from '../controllers/return-property-controller'
import understandCompensationController from '../controllers/understand-compensation-controller'
import victimsJourneyController from '../controllers/victims-journey-controller'
import victimPersonalStatementController from '../controllers/victim-personal-statement-controller'
import victimSupportLinksController from '../controllers/victim-support-links-controller'
import witnessServiceController from '../controllers/witness-service-controller'
import keyRolesController from '../controllers/key-roles-controller'

export default function caseRoutes(app: express.Express): void {
  // Page: Case dashboard
  app.get(
    paths.CASES.DASHBOARD,
    PasswordAuthenticated,
    asyncMiddleware((req, res, next) => {
      caseDashboardController(req, res, next)
    }),
  )

  // Card: Find your court information
  app.get(
    paths.CASES.COURT_INFORMATION,
    PasswordAuthenticated,
    AuthenticatedUser,
    asyncMiddleware((req, res, next) => {
      courtInformationController(req, res, next)
    }),
  )

  // Page: Enter your unique reference number
  // https://www.gov.uk/government/publications/common-platform-unique-reference-number-urn/purpose-of-the-urn-and-how-to-obtain-it
  app.get(paths.CASES.SEARCH, PasswordAuthenticated, AuthenticatedUser, asyncMiddleware(getEnterUniqueReferenceNumber))
  app.post(
    paths.CASES.SEARCH,
    PasswordAuthenticated,
    AuthenticatedUser,
    asyncMiddleware(postEnterUniqueReferenceNumber),
  )

  // Card: Understand the process
  app.get(
    paths.CASES.VICTIMS_JOURNEY,
    PasswordAuthenticated,
    asyncMiddleware((req, res, next) => {
      victimsJourneyController(req, res, next)
    }),
  )

  // Card: Understand key roles
  app.get(
    paths.CASES.KEY_ROLES,
    PasswordAuthenticated,
    asyncMiddleware((req, res, next) => {
      keyRolesController(req, res, next)
    }),
  )

  // Card: Get to know your rights
  app.get(
    paths.CASES.VICTIM_PERSONAL_STATEMENT,
    PasswordAuthenticated,
    asyncMiddleware((req, res, next) => {
      victimPersonalStatementController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.UNDERSTAND_COMPENSATION,
    PasswordAuthenticated,
    asyncMiddleware((req, res, next) => {
      understandCompensationController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.RETURN_PROPERTY,
    PasswordAuthenticated,
    asyncMiddleware((req, res, next) => {
      returnPropertyController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.VICTIMS_CODE,
    PasswordAuthenticated,
    asyncMiddleware((req, res, next) => {
      victimsCodeController(req, res, next)
    }),
  )

  // Card: Find help and support
  app.get(
    paths.CASES.VICTIM_SUPPORT_LINKS,
    PasswordAuthenticated,
    asyncMiddleware((req, res, next) => {
      victimSupportLinksController(req, res, next)
    }),
  )

  app.get(
    paths.CASES.WITNESS_SERVICE,
    PasswordAuthenticated,
    asyncMiddleware((req, res, next) => {
      witnessServiceController(req, res, next)
    }),
  )
}
