import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const accessDeniedController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Access denied'
    res.locals.backLink = paths.START

    res.render('pages/access-denied.njk')
  } catch (error) {
    next(error)
  }
}

export default accessDeniedController
