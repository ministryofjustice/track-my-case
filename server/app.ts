import express from 'express'
import cookieParser from 'cookie-parser'

import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'

import setupCsrf from './middleware/setupCsrf'

import setupStaticResources from './middleware/setupStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setupWebSecurity from './middleware/setupWebSecurity'
import setupWebSession from './middleware/setupWebSession'

import indexRoutes from './routes/indexRoutes'
import caseRoutes from './routes/caseRoutes'
import oneLoginRoutes from './routes/oneLoginRoutes'
import cookiesRoutes from './routes/cookiesRoutes'
import healthRoutes from './routes/healthRoutes'
import { setUpGovukOneLogin } from './middleware/setupGovukOneLogin'
import { rateLimitSetup } from './utils/rateLimitSetUp'
import setupGoogleTagManager from './middleware/setupGoogleTagManager'

export default function createApp(): express.Application {
  const app = express()

  // const isProduction = process.env.NODE_ENV === 'production'

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.NODE_PORT || 9999)

  // TODO: setup health checks

  app.use(setupWebSecurity())
  app.use(setUpWebRequestParsing())
  app.use(setupWebSession())
  app.use(setupStaticResources())
  nunjucksSetup(app)
  app.use(setUpGovukOneLogin())
  app.use(setupCsrf())
  app.use(setupGoogleTagManager())

  // Configure body-parser
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Configure parsing cookies - required for storing nonce in authentication
  app.use(cookieParser())

  // Apply the general rate limiter to all requests to prevent abuse
  rateLimitSetup(app)

  indexRoutes(app)
  healthRoutes(app)
  cookiesRoutes(app)
  oneLoginRoutes(app)
  caseRoutes(app)

  app.use('/.well-known/appspecific', (req, res) => {
    res.status(404).send('Not Found')
  })

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(false)) // ToDo: was isProduction, not ready for that yet

  return app
}
