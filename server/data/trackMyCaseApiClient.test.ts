import nock from 'nock'
import TrackMyCaseApiClient from './trackMyCaseApiClient'
import config from '../config'

describe('TrackMyCaseApiClient', () => {
  const baseUrl = config.apis.trackMyCaseApi.url.replace(/\/$/, '')
  const client = new TrackMyCaseApiClient()

  afterEach(() => {
    nock.cleanAll()
  })

  it('calls GET with object-style path and returns parsed JSON', async () => {
    const path = '/test/endpoint'
    const mockResponse = { message: 'hello' }

    nock(baseUrl).get(path).reply(200, mockResponse)

    const result = await client.get<typeof mockResponse>({ path })
    expect(result).toEqual(mockResponse)
  })
})
