import { UpstreamHealth } from '../interfaces/upstreamHealth'
import getAppInfo from '../applicationInfo'

export type HealthCheckResult = {
  status: 'UP' | 'DOWN'
  application: ReturnType<typeof getAppInfo>
  upstream?: UpstreamHealth
  reason?: string
}
