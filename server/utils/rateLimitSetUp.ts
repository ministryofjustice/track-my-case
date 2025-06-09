import rateLimit from 'express-rate-limit'
import config from '../config'
import { Express } from 'express-serve-static-core'

export const rateLimitSetup = (app: Express): void => {
  app.set('trust proxy', true)

  // Sets up rate limiting for the given Express app
  app.use(rateLimitConfig)
}

const rateLimitConfig = rateLimit({
  limit: config.rateLimit.limit, // limit each IP to X requests per windowMs
  windowMs: config.rateLimit.windowMs, // time interval in minutes
  message: config.rateLimit.message,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
  },
})
