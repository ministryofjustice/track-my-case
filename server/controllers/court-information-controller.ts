import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import CourtHearingService from '../services/courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'

import paths from '../constants/paths'
import courts from '../constants/courts'
import config from '../config'
import { CaseDetails, CaseDetailsResponse, HearingDetails } from '../interfaces/caseDetails'
import { mapCaseDetailsToHearingSummary } from '../mappers/caseDetailsService'

const trackMyCaseApiClient = new TrackMyCaseApiClient()
const courtHearingService = new CourtHearingService(trackMyCaseApiClient)

const courtInformationController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Court information'
    res.locals.backLink = paths.CASES.DASHBOARD

    res.locals.displayHearing = config.featureFlags.displayHearing

    if (!res.locals.selectedUrn) {
      return res.redirect(paths.CASES.SEARCH)
    }

    const caseUrn: string = res.locals.selectedUrn
    if (caseUrn.toUpperCase() === 'SERVICEDOWN') {
      res.locals.pageTitle = 'Service unavailable'
      return res.status(404).render('pages/case/service-error')
    }

    const userEmail: string = res.locals.user.email
    const caseDetailsResponse: CaseDetailsResponse = await courtHearingService.getCaseDetailsByUrn(caseUrn, userEmail)
    const { statusCode } = caseDetailsResponse
    if (statusCode === 404) {
      res.locals.pageTitle = 'Court information - Not found'
      return res.status(404).render('pages/case/court-information-not-found')
    }
    if (statusCode === 403) {
      res.locals.pageTitle = 'Court information - Access denied'
      return res.status(403).render('pages/case/court-information-access-denied')
    }
    if (statusCode === 200) {
      res.locals.caseDetails = caseDetailsResponse.caseDetails as CaseDetails
      if (res.locals.caseDetails?.courtSchedule?.length > 0) {
        const courtSchedule = res.locals.caseDetails?.courtSchedule[0]

        if (courtSchedule?.hearings?.length > 0) {
          const hearing: HearingDetails = courtSchedule.hearings[0]
          res.locals.hearingData = mapCaseDetailsToHearingSummary(hearing)
          const courtUrl = courts.getCourtUrl(res.locals.hearingData.location.courtHouseName)
          res.locals.courtUrl = courtUrl ?? 'https://www.find-court-tribunal.service.gov.uk/'

          return res.render('pages/case/court-information')
        }

        res.locals.pageTitle = 'Court information - No hearings allocated'
        return res.status(404).render('pages/case/court-information-no-hearings-allocated', {
          error: `No hearings allocated for this case`,
        })
      }
    }
    res.locals.pageTitle = 'Court information - Not found'
    return res.status(404).render('pages/case/court-information-not-found')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Status ${error.status}, ${error.message}`)
    res.locals.pageTitle = 'Court information - Not found'
    return res.status(404).render('pages/case/court-information-not-found')
  }
}

export default courtInformationController
