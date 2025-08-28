import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const victimsCodeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'The Victims Code'
    res.locals.backLink = '/case/dashboard'

    res.render('pages/case/victims-code')
  } catch (error) {
    next(error)
  }
}

export default victimsCodeController
