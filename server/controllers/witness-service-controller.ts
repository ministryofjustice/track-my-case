import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const witnessServiceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Witness Service'
    res.locals.backLink = '/case/dashboard'

    res.render('pages/case/witness-service')
  } catch (error) {
    next(error)
  }
}

export default witnessServiceController
