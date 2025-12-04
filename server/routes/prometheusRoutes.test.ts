import express from 'express'
import request from 'supertest'
import prometheusRoutes from './prometheusRoutes'
import { register } from '../services/prometheusService'

// Mock the prometheus service
jest.mock('../services/prometheusService', () => {
  const mockRegister = {
    contentType: 'text/plain; version=0.0.4; charset=utf-8',
    metrics: jest
      .fn()
      .mockResolvedValue(
        '# HELP tmc_ui_application_availability Application availability status\n# TYPE tmc_ui_application_availability gauge\ntmc_ui_application_availability{status="up"} 1\n',
      ),
  }
  return {
    register: mockRegister,
    applicationAvailabilityGauge: {
      set: jest.fn(),
    },
  }
})

describe('prometheusRoutes', () => {
  let app: express.Express

  beforeEach(() => {
    app = express()
    prometheusRoutes(app)
    jest.clearAllMocks()
  })

  it('exposes /prometheus endpoint', async () => {
    const response = await request(app).get('/prometheus')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toContain('text/plain')
  })

  it('returns Prometheus metrics format', async () => {
    const response = await request(app).get('/prometheus')

    expect(response.text).toContain('# HELP')
    expect(response.text).toContain('# TYPE')
    expect(response.text).toContain('tmc_ui_application_availability')
  })

  it('handles errors gracefully', async () => {
    // Mock register.metrics to throw an error
    ;(register.metrics as jest.Mock).mockRejectedValueOnce(new Error('Metrics error'))

    const response = await request(app).get('/prometheus')

    expect(response.status).toBe(500)
  })
})
