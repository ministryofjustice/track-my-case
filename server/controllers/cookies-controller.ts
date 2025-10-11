import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const cookiesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Cookies'
    res.locals.backLink = '/'

    res.render('pages/cookies.njk')
  } catch (error) {
    next(error)
  }
}

export default cookiesController
