import TrackMyCaseApiClient, { GetPathAndEmailRequestOptions } from '../data/trackMyCaseApiClient'
import { logger } from '../logger'
import { CaseDetails, CaseDetailsResponse } from '../interfaces/caseDetails'
import { resolvePath } from '../utils/utils'

export default class CourtHearingService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async getCaseDetailsByUrn(urn: string, userEmail: string, userId: string): Promise<CaseDetailsResponse> {
    try {
      const path = resolvePath('/api/cases/:case_urn/casedetails', { case_urn: urn })
      const requestOptions: GetPathAndEmailRequestOptions = { path, userEmail, userId }
      const caseDetails: CaseDetails = await this.apiClient.getCaseDetailsByUrn(requestOptions)
      return {
        statusCode: 200,
        caseDetails,
      }
    } catch (e) {
      if (e?.status && e?.message) {
        if (e.status === 429) {
          const xRateLimitRetryAfterSeconds = 'x-rate-limit-retry-after-seconds'
          const retrySecondsHeader = e?.response?.headers[xRateLimitRetryAfterSeconds]
          logger.error(
            `Case details API error, HTTP Status ${e.status}, ${e.message}, Retry in ${retrySecondsHeader} seconds`,
          )
        } else {
          logger.error(`Case details API error, HTTP Status ${e.status}, ${e.message}`)
        }
        return {
          statusCode: e.status,
          message: e.message,
        }
      }
      return {
        statusCode: 404,
        message: `Unsuccessful response by urn: ${urn}`,
      }
    }
  }
}
// FNyhXf10aoFEokXHaM8144wiLqAYxaiu
