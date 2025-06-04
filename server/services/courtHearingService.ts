import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { CourtSchedule } from '../interfaces/caseHearing'
import paths from '../constants/paths'
import resolvePath from '../utils/resolvePath'
import { logger } from '../logger'
import { CaseDetails } from '../interfaces/caseDetails'

export default class CourtHearingService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async getHearings(caseId: string): Promise<CourtSchedule> {
    const path = resolvePath(paths.CASE.HEARINGS, { caseId })
    return this.apiClient.get<CourtSchedule>({ path })
  }

  async getCourtInformation(caseId: string): Promise<CourtSchedule[]> {
    const path = resolvePath(paths.CASE.INFO, { caseId })
    const response = await this.apiClient.get<CourtSchedule[]>({ path })

    logger.debug('CourtHearingService.getCourtInformation: successful response', {
      courtSchedule: response,
    })

    return response
  }

  async getCaseDetailsByUrn(urn: string): Promise<CaseDetails> {
    const path = resolvePath(paths.CASE.CASE_DETAILS, { urn })
    const response = await this.apiClient.get<CaseDetails>({ path })

    logger.debug('CourtHEaringService.getCaseDetailsByUrn: successful response', {
      caseDetails: response,
    })

    return response
  }
}
