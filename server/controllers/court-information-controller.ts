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

const mapOfReservedServiceErrors: { [key: string]: CaseDetailsResponse } = {
  NOTFOUND: {
    statusCode: 404,
    message: 'Not found',
    caseDetails: undefined,
  },
  BADREQUEST: {
    statusCode: 400,
    message: 'Bad request',
    caseDetails: undefined,
  },
  DENIED: {
    statusCode: 403,
    message: 'Access denied',
    caseDetails: undefined,
  },
  TOOMANY: {
    statusCode: 429,
    message: 'Too many requests',
    caseDetails: undefined,
  },
  SERVICEDOWN: {
    statusCode: 503,
    message: 'Service down',
    caseDetails: undefined,
  },
  CLOSED: {
    statusCode: 200,
    message: 'No further court dates',
    caseDetails: {
      caseUrn: 'CLOSED',
      caseStatus: 'CLOSED',
      courtSchedule: [],
    },
  },
}

const getCaseDetailsResponse = async (caseUrn: string, userEmail: string): Promise<CaseDetailsResponse> => {
  const errorCaseDetailsResponse: CaseDetailsResponse = mapOfReservedServiceErrors[caseUrn.toUpperCase()]
  if (errorCaseDetailsResponse) {
    return errorCaseDetailsResponse
  }
  return courtHearingService.getCaseDetailsByUrn(caseUrn, userEmail)
}

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
    const userEmail: string = res.locals.user.email
    const caseDetailsResponse: CaseDetailsResponse = await getCaseDetailsResponse(caseUrn, userEmail)
    const { statusCode } = caseDetailsResponse
    if (statusCode === 200) {
      res.locals.caseDetails = caseDetailsResponse.caseDetails as CaseDetails
      const { caseStatus } = res.locals.caseDetails

      if (caseStatus === 'CLOSED') {
        res.locals.pageTitle = 'Court information - No further court dates'
        res.locals.message = `Status ${statusCode}, case status ${caseStatus}, No further court dates`
        return res.render('pages/case/court-information-closed')
      }
      if (res.locals.caseDetails?.courtSchedule?.length > 0) {
        const courtSchedule = res.locals.caseDetails?.courtSchedule[0]

        if (courtSchedule?.hearings?.length > 0) {
          const hearing: HearingDetails = courtSchedule.hearings[0]
          res.locals.hearingData = mapCaseDetailsToHearingSummary(hearing)
          const courtUrl = courts.getCourtUrl(res.locals.hearingData.location.courtHouseName)
          res.locals.courtUrl = courtUrl ?? 'https://www.find-court-tribunal.service.gov.uk/'

          if (caseStatus === 'ACTIVE') {
            return res.render('pages/case/court-information')
          }
        }

        res.locals.message = `Status ${statusCode}, case status ${caseStatus}, No hearings allocated`
        res.locals.pageTitle = 'Court information - No hearings allocated'
        return res.status(404).render('pages/case/court-information-no-hearings-allocated', {
          error: `No hearings allocated for this case`,
        })
      }
    } else {
      const { message } = caseDetailsResponse
      res.locals.message = `Status code: ${statusCode}. ${message}`
      if (statusCode === 404) {
        res.locals.pageTitle = 'Court information - Not found'
        return res.status(404).render('pages/case/court-information-not-found')
      }
      if (statusCode === 400) {
        res.locals.pageTitle = 'Court information - Bad request'
        return res.status(404).render('pages/case/court-information-not-found')
      }
      if (statusCode === 403) {
        res.locals.pageTitle = 'Court information - Access denied'
        return res.status(404).render('pages/case/court-information-access-denied')
      }
      if (statusCode === 429) {
        res.locals.pageTitle = 'Court information - Too many requests'
        return res.status(404).render('pages/case/court-information-common-platform-unavailable')
      }
      if (statusCode === 503) {
        res.locals.pageTitle = 'Court information - Common platform unavailable'
        return res.status(404).render('pages/case/court-information-common-platform-unavailable')
      }

      res.locals.pageTitle = 'Court information - Not found'
      res.locals.message = `${res.locals.message} (unexpected status code)`

      return res.status(404).render('pages/case/court-information-not-found')
    }

    res.locals.pageTitle = 'Court information - No hearings allocated'
    res.locals.message = `Status code: ${statusCode}. No hearings allocated`

    return res.status(404).render('pages/case/court-information-not-found')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Status ${error.status}, ${error.message}`)
    res.locals.pageTitle = 'Court information - Not found'
    return res.status(404).render('pages/case/court-information-not-found')
  }
}

export default courtInformationController
