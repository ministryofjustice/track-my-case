import { NextFunction, Request, Response } from 'express'
import { ServiceHealth } from '../interfaces/caseDetails'
import healthCheckController from './health-controller'
import { UP } from '../constants/healthStatus'

const mockGetServiceHealth = jest.fn()
jest.mock('../services/healthService', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        getServiceHealth: (...args: unknown[]) => mockGetServiceHealth(...args),
      }
    }),
  }
})

jest.mock('../data/trackMyCaseApiClient', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  }
})

jest.mock('../services/prometheusService', () => {
  return {
    updateApplicationAvailability: jest.fn(),
  }
})

describe('health-controller', () => {
  const createReqRes = (): { req: Request; res: Response; next: NextFunction } => {
    const req = {} as Request

    const res = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response

    const next = jest.fn() as NextFunction

    return { req, res, next }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 status when service health is UP', async () => {
    const { req, res, next } = createReqRes()

    const mockServiceHealth: ServiceHealth = {
      status: UP,
      application: {
        productId: 'tmc',
      },
    }

    mockGetServiceHealth.mockResolvedValue(mockServiceHealth)

    await healthCheckController(req, res, next)

    expect(mockGetServiceHealth).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockServiceHealth)
  })

  it('returns 503 status when service health is DOWN', async () => {
    const { req, res, next } = createReqRes()

    const mockServiceHealth: ServiceHealth = {
      status: 'DOWN',
      application: {
        productId: 'tmc',
      },
      reason: 'Service unavailable',
    }

    mockGetServiceHealth.mockResolvedValue(mockServiceHealth)

    await healthCheckController(req, res, next)

    expect(mockGetServiceHealth).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).toHaveBeenCalledWith(mockServiceHealth)
  })

  it('returns the complete service health response', async () => {
    const { req, res, next } = createReqRes()

    const mockServiceHealth: ServiceHealth = {
      status: UP,
      application: {
        productId: 'tmc',
      },
    }

    mockGetServiceHealth.mockResolvedValue(mockServiceHealth)

    await healthCheckController(req, res, next)

    expect(res.json).toHaveBeenCalledWith(mockServiceHealth)
  })

  it('handles service health with reason when DOWN', async () => {
    const { req, res, next } = createReqRes()

    const mockServiceHealth: ServiceHealth = {
      status: 'DOWN',
      application: {
        productId: 'tmc',
      },
      reason: 'Error calling service health endpoint',
    }

    mockGetServiceHealth.mockResolvedValue(mockServiceHealth)

    await healthCheckController(req, res, next)

    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).toHaveBeenCalledWith(mockServiceHealth)
  })
})
