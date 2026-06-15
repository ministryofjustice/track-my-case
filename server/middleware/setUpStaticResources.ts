import path from 'path'
import compression from 'compression'
import express, { Router } from 'express'
import noCache from 'nocache'

import config from '../config'

export default function setUpStaticResources(): Router {
  const router: Router = express.Router()

  router.use(compression())

  //  Static Resources Configuration
  const staticResourcesConfig = { maxAge: config.staticResourceCacheDuration, redirect: false }

  Array.of(
    '/dist/assets',
    '/node_modules/govuk-frontend/dist/govuk/assets',
    '/node_modules/govuk-frontend/dist',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
  ).forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), staticResourcesConfig))
  })

  Array.of('favicon.ico', 'favicon.svg').forEach((item: string) => {
    const paths = `/assets/images/${item}`
    express.static(path.join(process.cwd(), paths), staticResourcesConfig)
  })

  // Don't cache dynamic resources
  router.use(noCache())

  return router
}
