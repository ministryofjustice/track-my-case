import express from 'express'
import session from 'express-session'
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

export default function createApp(): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.NODE_PORT || 9999)

  // TODO: setup health checks

  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app)

  app.use(setUpCsrf())

  // Configure body-parser
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Configure parsing cookies - required for storing nonce in authentication
  app.use(cookieParser())

  // Set up a session to track whether the user is logged in
  app.use(
    session({
      name: 'simple-session',
      secret: 'this-is-a-secret',
      cookie: {
        maxAge: 1000 * 120 * 60, // 2 hours
        secure: false,
        httpOnly: true,
      },
      resave: false,
      saveUninitialized: true,
    }),
  )

  app.use('/', indexRoutes())
  app.use('/', healthRoutes())
  oneLoginRoutes(app)
  caseRoutes(app)
  app.use('/', publicRoutes())

  app.use('/.well-known/appspecific', (req, res) => {
    res.status(404).send('Not Found')
  })

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
