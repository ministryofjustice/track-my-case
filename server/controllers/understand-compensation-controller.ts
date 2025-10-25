import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const understandCompensationController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Understand compensation'
    res.locals.backLink = paths.CASES.DASHBOARD

    res.render('pages/case/understand-compensation')
  } catch (error) {
    next(error)
  }
}

export default understandCompensationController
