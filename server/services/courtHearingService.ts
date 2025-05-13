import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { CourtSchedule } from '../interfaces/caseHearing'
import paths from '../constants/paths'
import resolvePath from '../utils/resolvePath'
import logger from '../../logger'

export default class CourtHearingService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async getHearings(caseId: string): Promise<CourtSchedule> {
    const path = resolvePath(paths.CASES.HEARINGS, { caseId })
    return this.apiClient.get<CourtSchedule>({ path })
  }

  async getCourtInformation(caseId: string = '12345'): Promise<CourtSchedule[]> {
    const path = resolvePath(paths.CASES.INFO, { caseId })
    const response = await this.apiClient.get<CourtSchedule[]>({ path })

    logger.debug('CourtHearingService.getCourtInformation: successful response', {
      courtSchedule: response,
    })

    return response
  }
}
