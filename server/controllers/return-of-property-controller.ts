import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const returnOfPropertyController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Return of property'
    res.locals.backLink = '/case/dashboard'

    res.render('pages/case/return-of-property')
  } catch (error) {
    next(error)
  }
}

export default returnOfPropertyController
