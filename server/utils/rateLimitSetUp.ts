import rateLimit from 'express-rate-limit'
import config from '../config'

/**
 * Sets up rate limiting for the given Express app.
 */
export const rateLimitSetup = rateLimit({
  limit: config.rateLimit.limit, // limit each IP to X requests per windowMs
  windowMs: config.rateLimit.windowMs, // time interval in minutes
  message: config.rateLimit.message,
})
