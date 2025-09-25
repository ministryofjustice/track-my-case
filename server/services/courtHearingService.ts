import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { CourtSchedule } from '../interfaces/caseHearing'
import paths from '../constants/paths'
import resolvePath from '../utils/resolvePath'
import { logger } from '../logger'
import { CaseDetails, ServiceHealth } from '../interfaces/caseDetails'

export default class CourtHearingService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async getHearings(caseId: string): Promise<CourtSchedule> {
    const path = resolvePath(paths.CASES.HEARINGS, { caseId })
    return this.apiClient.get<CourtSchedule>({ path })
  }

  async getCourtInformation(caseId: string): Promise<CourtSchedule[]> {
    const path = resolvePath(paths.CASES.INFO, { caseId })
    const response = await this.apiClient.get<CourtSchedule[]>({ path })

    logger.debug('CourtHearingService.getCourtInformation: successful response', {
      courtSchedule: response,
    })

    return response
  }

  async getCaseDetailsByUrn(urn: string): Promise<CaseDetails> {
    try {
      const path = resolvePath(paths.CASES.CASE_DETAILS, { urn })
      const response = await this.apiClient.get<CaseDetails>({ path })
      logger.info(`CourtHearingService.getCaseDetailsByUrn: successful response by urn:${urn}`)
      return response
    } catch (e) {
      logger.error(`CourtHearingService.getCaseDetailsByUrn: unsuccessful response by urn:${urn}`, e)
      return null
    }
  }

  async getServiceHealth(): Promise<ServiceHealth> {
    try {
      const path = '/health'
      return await this.apiClient.get<ServiceHealth>({ path })
    } catch (e) {
      logger.error('CourtHearingService.getServiceHealth: unsuccessful response', e)
      return null
    }
  }
}
