import HealthService from './healthService'
import { UpstreamHealth } from '../interfaces/upstreamHealth'
import getAppInfo from '../applicationInfo'
import * as appInfo from '../applicationInfo'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'

describe('HealthService', () => {
  let mockGet: jest.Mock
  let service: HealthService

  beforeAll(() => {
    const fakeAppInfo: ReturnType<typeof getAppInfo> = {
      applicationName: 'track-my-case-ui',
      buildNumber: '20240511.1',
      gitRef: 'abc123abcdef',
      gitShortHash: 'abc123',
      productId: 'tmc',
      branchName: 'main',
    }

    jest.spyOn(appInfo, 'default').mockReturnValue(fakeAppInfo)
  })

  class MockTrackMyCaseApiClient {
    get = jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()

    const mockClient = new MockTrackMyCaseApiClient()
    mockGet = mockClient.get

    service = new HealthService(mockClient as unknown as TrackMyCaseApiClient)
  })

  it('returns UP and upstream info when API call succeeds', async () => {
    const upstream: UpstreamHealth = {
      status: 'UP',
      version: '1.0.0',
    }

    mockGet.mockResolvedValue(upstream)

    const result = await service.check()

    expect(mockGet).toHaveBeenCalledWith({ path: '/health' })
    expect(result.status).toBe('UP')
    expect(result.upstream).toEqual(upstream)
    expect(result.application).toEqual(getAppInfo())
  })

  it('returns DOWN with reason if API call fails', async () => {
    mockGet.mockRejectedValue(new Error('Service unavailable'))

    const result = await service.check()

    expect(mockGet).toHaveBeenCalledWith({ path: '/health' })
    expect(result.status).toBe('DOWN')
    expect(result.reason).toBe('Service unavailable')
  })

  it('handles non-Error exceptions defensively', async () => {
    mockGet.mockRejectedValue('some string')

    const result = await service.check()

    expect(mockGet).toHaveBeenCalledWith({ path: '/health' })
    expect(result.status).toBe('DOWN')
    expect(result.reason).toBe('Unknown error contacting trackMyCaseApi')
  })
})
