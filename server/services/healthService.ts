import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { UpstreamHealth } from '../interfaces/upstreamHealth'
import { HealthCheckResult } from '../types/HealthCheckResult'
import getAppInfo from '../applicationInfo'

export default class HealthService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async check(): Promise<HealthCheckResult> {
    const application = getAppInfo()

    try {
      const upstream: UpstreamHealth = await this.apiClient.get<UpstreamHealth>({
        path: '/health',
      })

      return { status: 'UP', application, upstream }
    } catch (error: unknown) {
      const reason = error instanceof Error ? error.message : 'Unknown error contacting trackMyCaseApi'
      return { status: 'DOWN', application, reason }
    }
  }
}
