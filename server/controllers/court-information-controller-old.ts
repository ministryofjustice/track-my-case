import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const courtInformationControllerOld = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Court information'
    res.locals.backLink = '/case/dashboard'

    res.render('pages/case/court-information-old')
  } catch (error) {
    next(error)
  }
}

export default courtInformationControllerOld
