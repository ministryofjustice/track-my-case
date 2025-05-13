import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'

export const caseSelectController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Select your case'
    res.locals.radioItems = [
      { value: '1110987654321', text: 'CRN 1110987654321 (Burglary)' },
      { value: '1234567891011', text: 'CRN 1234567891011 (Assault)' },
    ]

    res.render('pages/case/select.njk')
  } catch (error) {
    next(error)
  }
}
