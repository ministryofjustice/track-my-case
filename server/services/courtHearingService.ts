import TrackMyCaseApiClient, { GetPathAndEmailRequestOptions } from '../data/trackMyCaseApiClient'
import { logger } from '../logger'
import { CaseDetailsResponse } from '../interfaces/caseDetails'
import { resolvePath } from '../utils/utils'

export default class CourtHearingService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async getCaseDetailsByUrn(urn: string, userEmail: string): Promise<CaseDetailsResponse> {
    try {
      const path = resolvePath('/api/cases/:case_urn/casedetails', { case_urn: urn })
      const request: GetPathAndEmailRequestOptions = { path, userEmail }
      const caseDetails = await this.apiClient.getCaseDetailsByUrn(request)
      return {
        statusCode: 200,
        caseDetails,
      }
    } catch (e) {
      if (e?.status === 403) {
        logger.error('User access forbidden', e.status, e.message)
        return {
          statusCode: 403,
          message: 'Access forbidden',
        }
      }

      logger.error('Unsuccessful response by urn', e.status, e.message)
      return {
        statusCode: 404,
        message: `Unsuccessful response by urn: ${urn}`,
      }
    }
  }
}
