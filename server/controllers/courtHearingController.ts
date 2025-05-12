import { Request, Response } from 'express'
import CourtHearingService from '../services/courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'

const apiClient = new TrackMyCaseApiClient()
const courtHearingService = new CourtHearingService(apiClient)

/**
 * Controller for rendering the court information page with hearing data.
 * This is currently wired to GET /case/court-information-2
 */

// TODO: remove eslint-disable
// eslint-disable-next-line import/prefer-default-export
export const getHearingsAndRender = async (req: Request, res: Response): Promise<void> => {
  // TODO: Replace this with real case ID source (e.g., session, user context, param)
  const caseId = req.query.caseId || '12345'

  try {
    const hearingData = await courtHearingService.getCourtInformation(caseId as string)

    res.render('pages/case/court-information-2', {
      pageTitle: 'Court information',
      hearingData,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    res.status(500).render('pages/case/court-information-2', {
      pageTitle: 'Court information',
      error: `Unable to load hearings: ${message}`,
    })
  }
}
