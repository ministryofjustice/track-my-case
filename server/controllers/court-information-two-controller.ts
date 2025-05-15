import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import CourtHearingService from '../services/courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'

const trackMyCaseApiClient = new TrackMyCaseApiClient()
const courtHearingService = new CourtHearingService(trackMyCaseApiClient)

export const courtInformationTwoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
  view: string,
): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Court information'

    const caseId = (req.query.caseId as string) || '12345'
    const courtSchedules = await courtHearingService.getCourtInformation(caseId)
    const courtSchedule = courtSchedules[0]

    res.locals.hearingData = []
    if (!courtSchedule) {
      return res.status(404).render('pages/case/court-information-2', {
        pageTitle: 'Court information',
        error: 'No court schedule found for this case.',
      })
    }

    res.locals.hearingData = courtSchedule

    res.render(view)
  } catch (error) {
    next(error)
  }
}
