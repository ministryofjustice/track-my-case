import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { HealthCheckResult } from '../types/HealthCheckResult'
import getAppInfo from '../applicationInfo'
import { ServiceHealth } from '../interfaces/caseDetails'

export default class HealthService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async check(): Promise<HealthCheckResult> {
    const application = getAppInfo()

    try {
      const serviceHealth: ServiceHealth = await this.apiClient.getHealth<ServiceHealth>({
        path: '/health',
      })
      return {
        status: serviceHealth.status,
        application,
      }
    } catch (error: unknown) {
      const reason = error instanceof Error ? error.message : 'Unknown error contacting trackMyCaseApi'
      return { status: 'DOWN', application, reason }
    }
  }
}
