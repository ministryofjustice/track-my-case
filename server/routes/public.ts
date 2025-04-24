import { Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function publicRoutes(): Router {
  const router = Router()

  router.get(
    '/support-guidance',
    asyncMiddleware((req, res) => {
      res.render('pages/public/support-guidance', { pageTitle: 'Support and guidance' })
    }),
  )

  router.get(
    '/understanding-the-process',
    asyncMiddleware((req, res) => {
      res.render('pages/public/understanding-the-process', { pageTitle: 'Understanding the process' })
    }),
  )

  router.get(
    '/victims-code',
    asyncMiddleware((req, res) => {
      res.render('pages/public/victims-code', { pageTitle: 'The Victims Code' })
    }),
  )

  return router
}
