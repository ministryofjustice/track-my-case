import { Request, Response } from 'express'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import HealthService from '../services/healthService'
import config from '../config'

const apiClient = new TrackMyCaseApiClient()
const service = new HealthService(apiClient)

const healthCheck = async (req: Request, res: Response): Promise<void> => {
  if (!config.apis.trackMyCaseApi.enabled) {
    const application = await service.check() // still gets appInfo
    res.status(503).json({
      ...application,
      reason: 'trackMyCaseApi is disabled in configuration',
    })
    return
  }

  const result = await service.check()
  res.status(result.status === 'UP' ? 200 : 503).json(result)
}

export default healthCheck
