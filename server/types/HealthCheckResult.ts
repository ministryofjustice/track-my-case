import getAppInfo from '../applicationInfo'

export type HealthCheckResult = {
  status: string
  application: ReturnType<typeof getAppInfo>
  reason?: string
}
