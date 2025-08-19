import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const caseDashboardController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Your case dashboard'
    res.locals.backLink = '/'
    // res.locals.caseReference = req.session.selectedUrn || req.session.selectedCrn
    // res.locals.pageTitleCaseReference = ` - Reference number: ${res.locals.caseReference}`

    // if (res.locals.caseReference) {
    //   res.render('pages/case/dashboard.njk')
    // } else {
    //   res.redirect(paths.CASES.SEARCH)
    // }
    res.render('pages/case/dashboard.njk')
  } catch (error) {
    next(error)
  }
}

export default caseDashboardController
