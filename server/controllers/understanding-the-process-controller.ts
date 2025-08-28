import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const understandingTheProcessController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Understanding the process'
    res.locals.backLink = '/case/dashboard'

    res.render('pages/case/understanding-the-process')
  } catch (error) {
    next(error)
  }
}

export default understandingTheProcessController
