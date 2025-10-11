import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const supportRolesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Key Roles In The Criminal Justice System'
    res.locals.backLink = '/case/dashboard'

    res.render('pages/case/support-roles')
  } catch (error) {
    next(error)
  }
}

export default supportRolesController
