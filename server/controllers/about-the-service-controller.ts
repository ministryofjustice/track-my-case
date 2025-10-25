import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const aboutTheServiceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'About the Track my case service'

    if (res.locals.authenticated) {
      if (req.headers?.referer && new URL(req.headers?.referer)?.pathname === paths.START) {
        res.locals.backLink = paths.START
      } else {
        res.locals.backLink = paths.CASES.DASHBOARD
      }
    } else {
      res.locals.backLink = paths.START
    }

    res.render('pages/case/about-the-service')
  } catch (error) {
    next(error)
  }
}

export default aboutTheServiceController
