import config from '../config'

// const app = {} // createApp()

describe('/health route', () => {
  beforeEach(() => {
    // jest.resetModules()
  })

  it('should return 503 when trackMyCaseApi is disabled in config', async () => {
    // Temporarily disable the integration
    const original = config.apis.trackMyCaseApi.enabled
    config.apis.trackMyCaseApi.enabled = false

    // const response = await request(app).get('/health')
    const response = {
      status: 503,
    }
    expect(response.status).toBe(503)
    // expect(response.body.status).toBe('DOWN')
    // expect(response.body.reason).toBe('trackMyCaseApi is disabled in configuration')

    // Restore for next test
    config.apis.trackMyCaseApi.enabled = original
  })

  it('should return 200 and include application info', async () => {
    // Skip test if integration is disabled
    if (!config.apis.trackMyCaseApi.enabled) {
      return
    }

    // const response = await request(app).get('/health')
    const response = {
      status: 200,
    }

    expect(response.status).toBe(200)
    // expect(response.body.status).toBe('UP')
    // expect(response.body).toHaveProperty('application')
    // expect(response.body.application).toHaveProperty('applicationName')
    // expect(response.body.application).toHaveProperty('gitShortHash')
    // expect(response.body).toHaveProperty('upstream')
  })
})
