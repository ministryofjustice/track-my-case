import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const privacyNoticeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = req.t('privacy-notice:pageTitle')

    if (res.locals.authenticated) {
      if (req.headers?.referer && new URL(req.headers?.referer)?.pathname === paths.START) {
        res.locals.backLink = paths.START
      } else {
        res.locals.backLink = paths.CASES.DASHBOARD
      }
    } else {
      res.locals.backLink = paths.START
    }

    res.render('pages/privacy-notice.njk')
  } catch (error) {
    next(error)
  }
}

export default privacyNoticeController
