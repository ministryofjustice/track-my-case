import express from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import {
  cookiesAcceptRejectController,
  getCookiesController,
  postCookiesController,
} from '../controllers/cookies-controller'
import paths from '../constants/paths'

export default function cookiesRoutes(app: express.Express): void {
  app.get(paths.COOKIES, asyncMiddleware(getCookiesController))
  app.post(paths.COOKIES, asyncMiddleware(postCookiesController))

  app.post(paths.COOKIES_DECISION, asyncMiddleware(cookiesAcceptRejectController))
}
