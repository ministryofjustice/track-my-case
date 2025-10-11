import express from 'express'
import cookieParser from 'cookie-parser'

import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'

import setUpCsrf from './middleware/setUpCsrf'

import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setUpRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import indexRoutes from './routes/indexRoutes'
import caseRoutes from './routes/caseRoutes'
import oneLoginRoutes from './routes/oneLoginRoutes'
import cookiesRoutes from './routes/cookiesRoutes'
import healthRoutes from './routes/healthRoutes'
import { setUpGovukOneLogin } from './middleware/setUpGovukOneLogin'
import { rateLimitSetup } from './utils/rateLimitSetUp'
import setUpGoogleTagManager from './middleware/setUpGoogleTagManager'

export default function createApp(): express.Application {
  const app = express()

  // const isProduction = process.env.NODE_ENV === 'production'

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.NODE_PORT || 9999)

  // TODO: setup health checks

  app.use(setUpWebSecurity())
  app.use(setUpWebRequestParsing())
  app.use(setUpWebSession())
  app.use(setUpStaticResources())
  nunjucksSetup(app)
  app.use(setUpGovukOneLogin())
  app.use(setUpCsrf())
  app.use(setUpGoogleTagManager())

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
