import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import CourtHearingService from '../services/courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'

import mapCaseDetailsToHearingSummary from '../mappers/mapCaseDetailsToHearingSummary'
import paths from '../constants/paths'

const trackMyCaseApiClient = new TrackMyCaseApiClient()
const courtHearingService = new CourtHearingService(trackMyCaseApiClient)

const courtInformationController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Court information'
    res.locals.backLink = '/case/dashboard'

    const caseId = req.session.selectedUrn || 'wrong-case-id'
    res.locals.selectedUrn = req.session.selectedUrn

    res.locals.caseConfirmed = req.session.caseConfirmed
    if (!res.locals.caseConfirmed) {
      res.redirect(paths.CASES.SEARCH)
    }

    const caseDetails = await courtHearingService.getCaseDetailsByUrn(caseId)
    res.locals.caseDetails = caseDetails

    const courtSchedule = caseDetails.courtSchedule[0]
    if (!courtSchedule) {
      return res.status(404).render('pages/case/court-information', {
        pageTitle: 'Court information',
        error: 'No court schedule found for this case.',
      })
    }

    const viewModel = mapCaseDetailsToHearingSummary(caseDetails)
    res.locals.hearingData = viewModel

    return res.render('pages/case/court-information')
  } catch (error) {
    // next(error)
    const reason = `Status ${error.status}, ${error.message}`
    return res.status(404).render('pages/case/court-information', {
      pageTitle: 'Court information',
      error: `No court schedule found for this case: ${reason}`,
    })
  }
}

export default courtInformationController
