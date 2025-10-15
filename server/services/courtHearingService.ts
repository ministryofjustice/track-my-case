import TrackMyCaseApiClient, { GetHealthRequestOptions, GetRequestOptions } from '../data/trackMyCaseApiClient'
import paths from '../constants/paths'
import resolvePath from '../utils/resolvePath'
import { logger } from '../logger'
import { CaseDetailsResponse, ServiceHealth } from '../interfaces/caseDetails'

export default class CourtHearingService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async getServiceHealth(): Promise<ServiceHealth> {
    try {
      const path = '/health'
      const request: GetHealthRequestOptions = { path }
      return await this.apiClient.getHealth(request)
    } catch (e) {
      logger.error('courtHearingService.getServiceHealth: Unsuccessful response', e.status, e.message)
      return null
    }
  }

  async getCaseDetailsByUrn(urn: string, userEmail: string): Promise<CaseDetailsResponse> {
    try {
      const path = resolvePath(paths.CASES.CASE_DETAILS, { urn })
      const request: GetRequestOptions = { path, userEmail }
      const caseDetails = await this.apiClient.getCaseDetailsByUrn(request)
      return {
        statusCode: 200,
        caseDetails,
      }
    } catch (e) {
      if (e?.status === 403) {
        logger.error(`courtHearingService.getCaseDetailsByUrn: Access forbidden`, e.status, e.message)
        return {
          statusCode: 403,
          message: 'Access forbidden',
        }
      }

      logger.error(`courtHearingService.getCaseDetailsByUrn: Unsuccessful response by urn: ${urn}`, e.status, e.message)
      return {
        statusCode: 404,
        message: `Unsuccessful response by urn: ${urn}`,
      }
    }
  }
}
