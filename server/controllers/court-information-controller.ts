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
  INACTIVE: {
    statusCode: 200,
    message: 'No further court dates',
    caseDetails: {
      caseUrn: 'INACTIVE',
      caseStatus: 'INACTIVE',
      courtSchedule: [],
    },
  },
}

const getCaseDetailsResponse = async (
  caseUrn: string,
  userEmail: string,
  userId: string,
): Promise<CaseDetailsResponse> => {
  const errorCaseDetailsResponse: CaseDetailsResponse = mapOfReservedServiceErrors[caseUrn.toUpperCase()]
  if (errorCaseDetailsResponse) {
    return errorCaseDetailsResponse
  }
  return courtHearingService.getCaseDetailsByUrn(caseUrn, userEmail, userId)
}

const courtInformationController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const pageTitle = 'Court information'
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = pageTitle
    res.locals.backLink = paths.CASES.SEARCH

    res.locals.displayHearing = config.featureFlags.displayHearing

    if (!res.locals.selectedUrn) {
      return res.redirect(paths.CASES.SEARCH)
    }

    const caseUrn: string = res.locals.selectedUrn
    const userEmail: string = res.locals.user.email
    const userId: string = res.locals.userId || res.locals.sessionId
    const caseDetailsResponse: CaseDetailsResponse = await getCaseDetailsResponse(caseUrn, userEmail, userId)
    const { statusCode } = caseDetailsResponse
    if (statusCode === 200) {
      res.locals.caseDetails = caseDetailsResponse.caseDetails as CaseDetails
      const { caseStatus } = res.locals.caseDetails

      if (caseStatus === 'INACTIVE') {
        res.locals.pageTitle = `No further court dates - ${pageTitle}`
        res.locals.message = `Status ${statusCode}, case status ${caseStatus}, No further court dates`
        return res.render('pages/case/court-information-inactive.njk')
      }
      if (res.locals.caseDetails?.courtSchedule?.length > 0) {
        const courtSchedule = res.locals.caseDetails?.courtSchedule[0]

        if (courtSchedule?.hearings?.length > 0) {
          const hearing: HearingDetails = courtSchedule.hearings[0]
          res.locals.hearingData = mapCaseDetailsToHearingSummary(hearing)
          const courtUrl = courts.getCourtUrl(res.locals.hearingData.location.courtHouseName)
          res.locals.courtUrl = courtUrl ?? 'https://www.find-court-tribunal.service.gov.uk/'

          if (caseStatus === 'ACTIVE' || caseStatus === 'SJP_REFERRAL') {
            return res.render('pages/case/court-information.njk')
          }
        }

        res.locals.message = `Status ${statusCode}, case status ${caseStatus}, No hearings allocated`
        res.locals.pageTitle = `No hearings allocated - ${pageTitle}`
        return res.status(404).render('pages/case/court-information-no-hearings-allocated', {
          error: `No hearings allocated for this case`,
        })
      }
    } else {
      const { message } = caseDetailsResponse
      res.locals.message = `Status code: ${statusCode}. ${message}`
      if (statusCode === 404) {
        res.locals.pageTitle = `Not found - ${pageTitle}`
        return res.status(404).render('pages/case/court-information-not-found')
      }
      if (statusCode === 400) {
        res.locals.pageTitle = `Bad request - ${pageTitle}`
        return res.status(404).render('pages/case/court-information-not-found')
      }
      if (statusCode === 403) {
        res.locals.pageTitle = `Access denied - ${pageTitle}`
        return res.status(404).render('pages/case/court-information-access-denied')
      }
      if (statusCode === 429) {
        res.locals.pageTitle = `Too many requests - ${pageTitle}`
        return res.status(404).render('pages/case/court-information-common-platform-unavailable')
      }
      if (statusCode === 503) {
        res.locals.pageTitle = `Common platform unavailable - ${pageTitle}`
        return res.status(404).render('pages/case/court-information-common-platform-unavailable')
      }

      res.locals.pageTitle = `Not found - ${pageTitle}`
      res.locals.message = `${res.locals.message} (unexpected status code)`

      return res.status(404).render('pages/case/court-information-not-found')
    }

    res.locals.pageTitle = `No hearings allocated - ${pageTitle}`
    res.locals.message = `Status code: ${statusCode}. No hearings allocated`

    return res.status(404).render('pages/case/court-information-not-found')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Status ${error.status}, ${error.message}`)
    res.locals.pageTitle = `Not found - ${pageTitle}`
    return res.status(404).render('pages/case/court-information-not-found')
  }
}

export default courtInformationController
