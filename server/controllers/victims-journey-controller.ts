import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const victimsJourneyController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Victims journey'
    res.locals.backLink = '/case/dashboard'

    res.render('pages/case/victims-journey')
  } catch (error) {
    next(error)
  }
}

export default victimsJourneyController
