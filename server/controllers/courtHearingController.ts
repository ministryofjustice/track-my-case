import { RequestHandler } from 'express'
import CourtHearingService from '../services/courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'

const renderCourtInformation = (service = new CourtHearingService(new TrackMyCaseApiClient())): RequestHandler => {
  return async (req, res, next) => {
    try {
      const caseId = (req.query.caseId as string) || '12345'

      const courtSchedules = await service.getCourtInformation(caseId)
      const courtSchedule = courtSchedules[0]

      if (!courtSchedule) {
        return res.status(404).render('pages/case/court-information-2', {
          pageTitle: 'Court information',
          error: 'No court schedule found for this case.',
        })
      }

      return res.render('pages/case/court-information-2', {
        pageTitle: 'Court information',
        hearingData: courtSchedule,
      })
    } catch (error) {
      return next(error)
    }
  }
}

export default renderCourtInformation
