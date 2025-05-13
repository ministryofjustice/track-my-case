import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

export const caseDashboardController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Your case dashboard'

    res.render('pages/case/dashboard.njk')
  } catch (error) {
    next(error)
  }
}
