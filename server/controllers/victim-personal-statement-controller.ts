import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const victimPersonalStatementController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Victim Personal Statement'
    res.locals.backLink = '/case/dashboard'

    res.render('pages/case/victim-personal-statement')
  } catch (error) {
    next(error)
  }
}

export default victimPersonalStatementController
