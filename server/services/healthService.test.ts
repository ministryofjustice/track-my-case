import HealthService from './healthService'
import getAppInfo from '../applicationInfo'
import * as appInfo from '../applicationInfo'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'

describe('HealthService', () => {
  let mockGetHealth: jest.Mock
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

  class MockTrackMyCaseApiClient extends TrackMyCaseApiClient {
    getHealth = jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()

    const mockClient = new MockTrackMyCaseApiClient()
    mockGetHealth = mockClient.getHealth

    service = new HealthService(mockClient as unknown as TrackMyCaseApiClient)
  })

  it('returns UP and upstream info when API call succeeds', async () => {
    mockGetHealth.mockReturnValue({ status: 'UP' })
    const result = await service.check()

    expect(mockGetHealth).toHaveBeenCalledWith({ path: '/health' })
    expect(result.status).toBe('UP')
    expect(result.application).toEqual(getAppInfo())
  })

  it('returns DOWN with reason if API call fails', async () => {
    mockGetHealth.mockRejectedValue(new Error('Service unavailable'))

    const result = await service.check()

    expect(mockGetHealth).toHaveBeenCalledWith({ path: '/health' })
    expect(result.status).toBe('DOWN')
    expect(result.reason).toBe('Service unavailable')
  })

  it('handles non-Error exceptions defensively', async () => {
    mockGetHealth.mockRejectedValue('some string')

    const result = await service.check()

    expect(mockGetHealth).toHaveBeenCalledWith({ path: '/health' })
    expect(result.status).toBe('DOWN')
    expect(result.reason).toBe('Unknown error contacting trackMyCaseApi')
  })
})
