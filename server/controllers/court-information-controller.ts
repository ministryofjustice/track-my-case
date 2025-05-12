import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

export const courtInformationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
  view: string,
): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Court information'

    res.render(view)
  } catch (error) {
    next(error)
  }
}
