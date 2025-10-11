import TrackMyCaseApiClient, { GetHealthRequestOptions, GetRequestOptions } from '../data/trackMyCaseApiClient'
import paths from '../constants/paths'
import resolvePath from '../utils/resolvePath'
import { logger } from '../logger'
import { CaseDetails, ServiceHealth } from '../interfaces/caseDetails'

export default class CourtHearingService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async getServiceHealth(): Promise<ServiceHealth> {
    try {
      const path = '/health'
      const request: GetHealthRequestOptions = { path }
      return await this.apiClient.getHealth<ServiceHealth>(request)
    } catch (e) {
      logger.error('courtHearingService.getServiceHealth: unsuccessful response', e.status, e.message)
      return null
    }
  }

  async getCaseDetailsByUrn(urn: string, userEmail: string): Promise<CaseDetails> {
    try {
      const path = resolvePath(paths.CASES.CASE_DETAILS, { urn })
      const request: GetRequestOptions = { path, userEmail }
      const response = await this.apiClient.getCaseDetailsByUrn<CaseDetails>(request)
      return response
    } catch (e) {
      logger.error(`courtHearingService.getCaseDetailsByUrn: unsuccessful response by urn: ${urn}`, e.status, e.message)
      return null
    }
  }
}
