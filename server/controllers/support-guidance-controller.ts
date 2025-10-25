import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const supportGuidanceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Support and guidance'
    res.locals.backLink = '/case/dashboard'

    res.render('pages/case/support-guidance')
  } catch (error) {
    next(error)
  }
}

export default supportGuidanceController
