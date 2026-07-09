import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

const requestingCourtHearingTranscriptController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = req.t('requesting-transcript:pageTitle')
    res.locals.backLink = paths.CASES.DASHBOARD

    res.render('pages/case/requesting-court-hearing-transcript.njk')
  } catch (error) {
    next(error)
  }
}

export default requestingCourtHearingTranscriptController
