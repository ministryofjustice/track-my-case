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
    res.locals.backLink = paths.CASES.DASHBOARD

    if (!res.locals.selectedUrn) {
      return res.redirect(paths.CASES.SEARCH)
    }

    const caseUrn: string = res.locals.selectedUrn
    const userEmail: string = res.locals.user.email
    const caseDetailsResponse = await courtHearingService.getCaseDetailsByUrn(caseUrn, userEmail)
    const { statusCode } = caseDetailsResponse
    if (statusCode === 404) {
      res.locals.pageTitle = 'Court Information - Not found'
      return res.status(404).render('pages/case/court-information-not-found', {
        error: 'Case could not be found',
      })
    }
    if (statusCode === 403) {
      res.locals.pageTitle = 'Court Information - Access denied'
      return res.status(403).render('pages/case/court-information-access-denied', {
        error: 'You are not authorized to access',
      })
    }
    if (statusCode === 200) {
      res.locals.caseDetails = caseDetailsResponse.caseDetails
      if (res.locals.caseDetails?.courtSchedule?.length > 0) {
        const courtSchedule = res.locals.caseDetails?.courtSchedule[0]

        if (courtSchedule?.hearings?.length > 0) {
          res.locals.hearingData = mapCaseDetailsToHearingSummary(res.locals.caseDetails)
          const courtUrl = courts.getCourtUrl(res.locals.hearingData.location.courtHouseName)
          res.locals.courtUrl = courtUrl ?? 'https://www.find-court-tribunal.service.gov.uk/'

          return res.render('pages/case/court-information')
        }

        res.locals.pageTitle = 'Court Information - Not found'
        return res.status(404).render('pages/case/court-information-no-hearings-allocated', {
          error: `No hearings allocated for this case`,
        })
      }
    }
    res.locals.pageTitle = 'Court Information - Not found'
    return res.status(404).render('pages/case/court-information-not-found', {
      error: 'Case could not be found',
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Status ${error.status}, ${error.message}`)
    res.locals.pageTitle = 'Court Information - Not found'
    return res.status(404).render('pages/case/court-information-not-found', {
      error: `Case could not be found`,
    })
  }
}

export default courtInformationController
