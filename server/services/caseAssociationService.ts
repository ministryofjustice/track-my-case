import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { caseAssociationsSchema, CaseAssociation } from '../interfaces/caseAssociation'
import paths from '../constants/paths'
import resolvePath from '../utils/resolvePath'
import { logger } from '../logger'

export default class CaseAssociationService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async getCaseAssociations(sub: string): Promise<CaseAssociation[]> {
    const path = resolvePath(paths.CASES.ASSOCIATIONS, { sub })
    const response = await this.apiClient.get<unknown>({ path })

    logger.debug('CaseAssociationService.getCaseAssociations: raw response', { response })

    const parsed = caseAssociationsSchema.safeParse(response)

    if (!parsed.success) {
      logger.error('CaseAssociationService.getCaseAssociations: response schema validation failed', {
        issues: parsed.error.issues,
      })
      throw new Error('Invalid case associations response')
    }

    logger.debug('CaseAssociationService.getCaseAssociations: successful response', {
      count: parsed.data.length,
    })

    return parsed.data
  }
}
