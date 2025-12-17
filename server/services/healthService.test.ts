import HealthService from './healthService'
import { UP } from '../constants/healthStatus'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { logger } from '../logger'

jest.mock('../config', () => ({
  __esModule: true,
  default: {
    productId: 'tmc',
    apis: {
      trackMyCaseApi: {
        url: 'http://localhost:1234',
      },
    },
  },
}))

const fakeAppInfo = {
  productId: 'tmc',
}

describe('HealthService', () => {
  let mockGetHealth: jest.Mock
  let service: HealthService

  class MockTrackMyCaseApiClient extends TrackMyCaseApiClient {
    getHealth = jest.fn()
  }

  beforeAll(() => {
    jest.spyOn(logger, 'error').mockImplementation(jest.fn())
  })

  beforeEach(() => {
    jest.clearAllMocks()

    const mockClient = new MockTrackMyCaseApiClient()
    mockGetHealth = mockClient.getHealth

    service = new HealthService(mockClient as unknown as TrackMyCaseApiClient)
  })

  it('returns UP and upstream info when API call succeeds', async () => {
    mockGetHealth.mockReturnValue({ status: UP })
    const result = await service.getServiceHealth()

    expect(mockGetHealth).toHaveBeenCalledWith()
    expect(result.status).toBe('UP')
    expect(result.application).toEqual({
      productId: fakeAppInfo.productId,
    })
  })

  it('returns DOWN with reason if API call fails', async () => {
    mockGetHealth.mockRejectedValue(new Error('Service unavailable'))

    const result = await service.getServiceHealth()

    expect(mockGetHealth).toHaveBeenCalledWith()
    expect(result.status).toBe('DOWN')
    expect(result.reason).toBe('Service unavailable')
    expect(result.application).toEqual({
      productId: fakeAppInfo.productId,
    })
  })

  it('handles non-Error exceptions defensively', async () => {
    mockGetHealth.mockRejectedValue('some string')

    const result = await service.getServiceHealth()

    expect(mockGetHealth).toHaveBeenCalledWith()
    expect(result.status).toBe('DOWN')
    expect(result.reason).toBe('Unknown error contacting trackMyCaseApi')
    expect(result.application).toEqual({
      productId: fakeAppInfo.productId,
    })
  })
})
