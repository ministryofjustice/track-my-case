import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const signedInController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Signed in'

    // res.render('pages/signed-in.njk')

    return res.redirect(paths.CASES.DASHBOARD)
  } catch (error) {
    return next(error)
  }
}

export default signedInController
