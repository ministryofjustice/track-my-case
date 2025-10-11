import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const caseDashboardController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Dashboard'
    res.locals.backLink = '/'
    res.render('pages/case/dashboard.njk')
  } catch (error) {
    next(error)
  }
}

export default caseDashboardController
