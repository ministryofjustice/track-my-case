import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const victimSupportLinksController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Links to victim support information'
    res.locals.backLink = paths.CASES.DASHBOARD

    res.render('pages/case/victim-support-links')
  } catch (error) {
    next(error)
  }
}

export default victimSupportLinksController
