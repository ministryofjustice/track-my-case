import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const victimPersonalStatementController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Victim personal statement'
    res.locals.backLink = paths.CASES.DASHBOARD

    res.render('pages/case/victim-personal-statement')
  } catch (error) {
    next(error)
  }
}

export default victimPersonalStatementController
