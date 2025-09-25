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

    const courtSchedule = res.locals.caseDetails?.courtSchedule[0]
    if (!courtSchedule) {
      return res.status(404).render('pages/case/court-information-not-found', {
        pageTitle: 'Court information',
        error: 'Case could not be found',
      })
    }

    const viewModel = mapCaseDetailsToHearingSummary(res.locals.caseDetails)
    res.locals.hearingData = viewModel

    return res.render('pages/case/court-information')
  } catch (error) {
    const reason = `Status ${error.status}, ${error.message}`
    return res.status(404).render('pages/case/court-information-not-found', {
      pageTitle: 'Court information',
      error: `Case could not be found`,
    })
  }
}

export default courtInformationController
