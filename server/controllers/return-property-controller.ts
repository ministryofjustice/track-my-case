import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const returnPropertyController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Return of property'
    res.locals.backLink = paths.CASES.DASHBOARD

    res.render('pages/case/return-property')
  } catch (error) {
    next(error)
  }
}

export default returnPropertyController
