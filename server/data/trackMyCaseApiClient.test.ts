import nock from 'nock'
import TrackMyCaseApiClient from './trackMyCaseApiClient'
import config from '../config'
import { UpstreamHealth } from '../interfaces/upstreamHealth'

describe('TrackMyCaseApiClient', () => {
  const baseUrl = config.apis.trackMyCaseApi.url
  const client = new TrackMyCaseApiClient()

  afterEach(() => {
    nock.cleanAll()
  })

  it('returns health status from upstream', async () => {
    const mockResponse: UpstreamHealth = {
      status: 'UP',
      version: '1.2.3',
    }

    nock(baseUrl).get('/health').reply(200, mockResponse)

    const result = await client.getHealth()
    expect(result).toEqual(mockResponse)
  })

  it('throws an error on non-200 response', async () => {
    nock(baseUrl).get('/health').reply(503, { status: 'DOWN' })

    await expect(client.getHealth()).rejects.toThrow()
  })
})
