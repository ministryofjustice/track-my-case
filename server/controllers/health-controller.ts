import { NextFunction, Request, Response } from 'express'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import HealthService from '../services/healthService'
import { ServiceHealth } from '../interfaces/caseDetails'
import { updateApplicationAvailability } from '../services/prometheusService'
import { UP } from '../constants/healthStatus'

const apiClient = new TrackMyCaseApiClient()
const service = new HealthService(apiClient)

const healthCheckController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const serviceHealth: ServiceHealth = await service.getServiceHealth()

  const { status } = serviceHealth
  const isAvailable = status === UP

  // Update metrics with current availability status
  updateApplicationAvailability(isAvailable, status.toLowerCase())

  res.status(status === UP ? 200 : 503).json(serviceHealth)
}

export default healthCheckController
