import express from 'express'
import cookieParser from 'cookie-parser'

import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'

import setUpCsrf from './middleware/setUpCsrf'

// TODO: set up HealthCheck
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import indexRoutes from './routes/index'
import caseRoutes from './routes/case'
import oneLoginRoutes from './routes/oneLogin'
import publicRoutes from './routes/public'
import healthRoutes from './routes/health'
import { setUpGovukOneLogin } from './middleware/setupGovukOneLogin'
import { rateLimitSetup } from './utils/rateLimitSetUp'
import { Express } from 'express-serve-static-core'

export default function createApp(): express.Application {
  const app: Express = express()

  const isProduction = process.env.NODE_ENV === 'production'

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.NODE_PORT || 9999)

  // TODO: setup health checks

  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app)
  app.use(setUpGovukOneLogin())
  app.use(setUpCsrf())

  // Configure body-parser
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Configure parsing cookies - required for storing nonce in authentication
  app.use(cookieParser())

  // Apply the general rate limiter to all requests to prevent abuse
  rateLimitSetup(app)

  app.use('/', indexRoutes())
  app.use('/', healthRoutes())
  oneLoginRoutes(app)
  caseRoutes(app)
  app.use('/', publicRoutes())

  app.use('/.well-known/appspecific', (req, res) => {
    res.status(404).send('Not Found')
  })

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(isProduction))

  return app
}
