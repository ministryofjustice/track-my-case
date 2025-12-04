import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client'
import HealthService from './healthService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { UP } from '../constants/healthStatus'

// Create a Registry to register all metrics
export const register = new Registry()

// Collect default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register })

// Application availability metric - tracks when TMC UI is not available
// This is the key metric for the acceptance criteria: "At the point that TMC UI is not available, there must be a way of capturing this state"
export const applicationAvailabilityGauge = new Gauge({
  name: 'tmc_ui_application_availability',
  help: 'Application availability status. 1 = available, 0 = not available',
  labelNames: ['status'],
  registers: [register],
})

// Health check status metric
export const healthCheckStatusGauge = new Gauge({
  name: 'tmc_ui_health_check_status',
  help: 'Health check status. 1 = UP, 0 = DOWN',
  labelNames: ['status', 'reason'],
  registers: [register],
})

// HTTP request counter
export const httpRequestCounter = new Counter({
  name: 'tmc_ui_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
})

// HTTP request duration histogram
export const httpRequestDuration = new Histogram({
  name: 'tmc_ui_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
})

let healthService: HealthService | null = null
let healthCheckInterval: NodeJS.Timeout | null = null

/**
 * Initialize metrics service and start periodic health checks
 */
export const initializePrometheusMetrics = (): void => {
  const apiClient = new TrackMyCaseApiClient()
  healthService = new HealthService(apiClient)

  // Set initial availability to 1 (available)
  applicationAvailabilityGauge.set({ status: 'available' }, 1)

  // Start periodic health checks to update availability metric
  // Check every 30 seconds
  healthCheckInterval = setInterval(async () => {
    if (healthService) {
      try {
        const health = await healthService.getServiceHealth()
        const isAvailable = health.status === UP ? 1 : 0

        // Update application availability
        applicationAvailabilityGauge.set({ status: health.status.toLowerCase() }, isAvailable)

        // Update health check status
        healthCheckStatusGauge.set(
          { status: health.status.toLowerCase(), reason: health.reason || 'none' },
          isAvailable,
        )
      } catch (error) {
        // If health check fails, mark as unavailable
        applicationAvailabilityGauge.set({ status: 'down' }, 0)
        healthCheckStatusGauge.set({ status: 'down', reason: 'health_check_failed' }, 0)
      }
    }
  }, 30 * 1000) // Check every N seconds
}

/**
 * Stop metrics collection and cleanup
 */
export const stopMetrics = (): void => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
    healthCheckInterval = null
  }
}

/**
 * Manually update application availability (for immediate updates)
 */
export const updateApplicationAvailability = (isAvailable: boolean, status: string = 'unknown'): void => {
  applicationAvailabilityGauge.set({ status }, isAvailable ? 1 : 0)
}
