import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const keyRolesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'People in the criminal justice system'
    res.locals.backLink = paths.CASES.DASHBOARD

    res.render('pages/case/key-roles')
  } catch (error) {
    next(error)
  }
}

export default keyRolesController
