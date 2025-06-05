import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import CourtHearingService from '../services/courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import mapCaseDetailsToHearingSummary from '../mappers/mapCaseDetailsToHearingSummary'

const trackMyCaseApiClient = new TrackMyCaseApiClient()
const courtHearingService = new CourtHearingService(trackMyCaseApiClient)

const courtInformationTwoController = async (
  req: Request,
  res: Response,
  next: NextFunction,
  view: string,
): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Court information'

    const caseId = (req.query.caseId as string) || '12345'
    const caseDetails = await courtHearingService.getCaseDetailsByUrn(caseId)
    const courtSchedule = caseDetails.courtSchedule[0]

    if (!courtSchedule) {
      return res.status(404).render('pages/case/court-information-2', {
        pageTitle: 'Court information',
        error: 'No court schedule found for this case.',
      })
    }

    const viewModel = mapCaseDetailsToHearingSummary(caseDetails)
    res.locals.hearingData = viewModel

    res.render(view)
  } catch (error) {
    next(error)
  }
}

export default courtInformationTwoController
