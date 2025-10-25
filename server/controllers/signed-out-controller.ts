import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const signedOutController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Signed out'

    // res.render('pages/signed-out.njk')

    return res.redirect(paths.START)
  } catch (error) {
    return next(error)
  }
}

export default signedOutController
