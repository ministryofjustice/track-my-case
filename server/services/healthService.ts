import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { ApiServiceHealth, ApplicationInfo, ServiceHealth } from '../interfaces/caseDetails'
import { logger } from '../logger'
import config from '../config'
import { DOWN, UP } from '../constants/healthStatus'

const getApplicationInfo = (): ApplicationInfo => {
  return {
    productId: config.productId,
  }
}

export default class HealthService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async getServiceHealth(): Promise<ServiceHealth> {
    const application = getApplicationInfo()
    let reason
    try {
      const serviceHealth: ApiServiceHealth = await this.apiClient.getHealth()
      if (serviceHealth?.status === UP) {
        return {
          status: UP,
          application,
        }
      }
      reason = 'Error calling service health endpoint'
    } catch (e) {
      logger.error('Unsuccessful response on service health:', e.status, e.message)
      reason = e instanceof Error ? e.message : 'Unknown error contacting trackMyCaseApi'
    }
    return {
      status: DOWN,
      application,
      reason,
    }
  }
}
