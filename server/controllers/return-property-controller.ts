import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const returnPropertyController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Return of property'
    res.locals.backLink = '/case/dashboard'

    res.render('pages/case/return-property')
  } catch (error) {
    next(error)
  }
}

export default returnPropertyController
