import express, { NextFunction, Request, Response } from 'express'
import middleware from 'i18next-http-middleware/cjs'
import i18next from './i18next'

const i18nextSetup = (app: express.Express): void => {
  app.use(
    middleware.handle(i18next, {
      ignoreRoutes: [],
      removeLngFromUrl: false,
    }),
  )

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.t = req.t
    res.locals.applicationName = req.t('applicationName')
    next()
  })
}
export default i18nextSetup
