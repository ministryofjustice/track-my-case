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
    const userEmail = 'example@user.com'
    const mockResponse = { message: 'hello' }

    nock(baseUrl).get(path).reply(200, mockResponse)

    const result = await client.getCaseDetailsByUrn<typeof mockResponse>({ path, userEmail })
    expect(result).toEqual(mockResponse)
  })
})
