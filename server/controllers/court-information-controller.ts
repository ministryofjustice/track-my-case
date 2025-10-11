import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import CourtHearingService from '../services/courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'

import mapCaseDetailsToHearingSummary from '../mappers/mapCaseDetailsToHearingSummary'
import paths from '../constants/paths'
import courts from '../constants/courts'

const trackMyCaseApiClient = new TrackMyCaseApiClient()
const courtHearingService = new CourtHearingService(trackMyCaseApiClient)

const courtInformationController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Court Information'
    res.locals.backLink = '/case/dashboard'

    const caseId = req.session.selectedUrn || 'wrong-case-id'
    res.locals.selectedUrn = req.session.selectedUrn

    res.locals.caseConfirmed = req.session.caseConfirmed
    if (!res.locals.caseConfirmed) {
      res.redirect(paths.CASES.SEARCH)
    }

    const userEmail = res.locals.user.email
    res.locals.caseDetails = await courtHearingService.getCaseDetailsByUrn(caseId, userEmail)

    const courtSchedule = res.locals.caseDetails?.courtSchedule[0]
    if (!courtSchedule) {
      res.locals.pageTitle = 'Court Information - Not Found'
      return res.status(404).render('pages/case/court-information-not-found', {
        error: 'Case could not be found',
      })
    }

    res.locals.hearingData = mapCaseDetailsToHearingSummary(res.locals.caseDetails)
    const courtUrl = courts.getCourtUrl(res.locals.hearingData.location.courtHouseName)
    res.locals.courtUrl = courtUrl ?? 'https://www.find-court-tribunal.service.gov.uk/'

    return res.render('pages/case/court-information')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Status ${error.status}, ${error.message}`)
    res.locals.pageTitle = 'Court Information - Not Found'
    return res.status(404).render('pages/case/court-information-not-found', {
      error: `Case could not be found`,
    })
  }
}

export default courtInformationController
