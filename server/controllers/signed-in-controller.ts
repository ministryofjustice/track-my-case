import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const signedInController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Signed in'

    // res.render('pages/signed-in.njk')

    const path = req.originalUrl === paths.CASES.DASHBOARD ? paths.CASES.SEARCH : paths.CASES.DASHBOARD
    return res.redirect(path)
  } catch (error) {
    return next(error)
  }
}

export default signedInController
