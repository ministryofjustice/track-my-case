import { Request, Response } from 'express'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import HealthService from '../services/healthService'
import config from '../config'

const apiClient = new TrackMyCaseApiClient()
const service = new HealthService(apiClient)

const healthCheckController = async (req: Request, res: Response): Promise<void> => {
  const healthCheckResult = await service.check() // still gets appInfo
  if (!config.apis.trackMyCaseApi.enabled) {
    res.status(503).json({
      ...healthCheckResult,
      reason: 'trackMyCaseApi is disabled in configuration',
    })
    return
  }
  res.status(healthCheckResult.status === 'UP' ? 200 : 503).json(healthCheckResult)
}

export default healthCheckController
