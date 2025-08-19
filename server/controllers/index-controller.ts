import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

const indexController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.useOneLogin = true
    res.locals.currentTime = new Date().toISOString()

    res.render('pages/index.njk')
  } catch (error) {
    next(error)
  }
}

export default indexController
