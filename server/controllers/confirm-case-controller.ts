import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const confirmCaseController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Confirm case'
    res.locals.backLink = '/case/search'
    res.locals.caseReference = req.session.selectedUrn
    res.locals.pageTitleCaseReference = ` - Reference number: ${res.locals.caseReference}`

    if (res.locals.caseReference) {
      res.render('pages/case/confirm-case.njk')
    } else {
      res.redirect(paths.CASES.SEARCH)
    }
  } catch (error) {
    next(error)
  }
}

export default confirmCaseController
