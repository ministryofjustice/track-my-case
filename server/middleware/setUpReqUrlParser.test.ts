import express, { Request, Response } from 'express'
import request from 'supertest'
import setUpReqUrlParser from './setUpReqUrlParser'
import { logger } from '../logger'

// Mock the logger
jest.mock('../logger', () => ({
  logger: {
    info: jest.fn(),
  },
}))

describe('setUpReqUrlParser', () => {
  let app: express.Express

  beforeEach(() => {
    app = express()
    app.use(setUpReqUrlParser())

    // Add a catch-all route to verify URL normalization
    app.use((req: Request, res: Response) => {
      res.json({ url: req.url })
    })

    jest.clearAllMocks()
  })

  describe('URL normalization', () => {
    it('normalizes URLs with multiple consecutive slashes', async () => {
      const response = await request(app).get('///case///support-roles')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/support-roles')
    })

    it('normalizes URLs with many consecutive slashes', async () => {
      const response = await request(app).get('//////case//////dashboard')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/dashboard')
    })

    it('normalizes URLs with multiple slashes in the middle', async () => {
      const response = await request(app).get('/case//support//roles')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/support/roles')
    })

    it('preserves query strings when normalizing URLs', async () => {
      const response = await request(app).get('///case///support-roles?redirect=http://www.example.com/authorise')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/support-roles?redirect=http://www.example.com/authorise')
    })

    it('preserves multiple query parameters', async () => {
      const response = await request(app).get(
        '///case///dashboard?param1=value1&param2=value2&redirect=http://www.example.com/authorise',
      )

      expect(response.status).toBe(200)
      expect(response.body.url).toBe(
        '/case/dashboard?param1=value1&param2=value2&redirect=http://www.example.com/authorise',
      )
    })

    it('does not modify URLs without multiple slashes', async () => {
      const response = await request(app).get('/case/support-roles')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/support-roles')
    })

    it('does not modify URLs with query strings when no normalization needed', async () => {
      const response = await request(app).get('/case/dashboard?redirect=http://www.example.com')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/dashboard?redirect=http://www.example.com')
    })
  })

  describe('assets path exclusion', () => {
    it('skips normalization for paths starting with /assets (already normalized)', async () => {
      const response = await request(app).get('/assets/css/style.css')

      expect(response.status).toBe(200)
      // Should not normalize /assets paths that are already normalized
      expect(response.body.url).toBe('/assets/css/style.css')
    })

    it('normalizes paths starting with multiple slashes before /assets', async () => {
      const response = await request(app).get('///assets///css///style.css')

      expect(response.status).toBe(200)
      // The middleware normalizes because ///assets doesn't start with /assets
      expect(response.body.url).toBe('/assets/css/style.css')
    })

    it('normalizes /assets with query strings when path has multiple slashes', async () => {
      const response = await request(app).get('///assets///js///app.js?v=1.0.0')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/assets/js/app.js?v=1.0.0')
    })

    it('skips normalization for /assets with query strings when already normalized', async () => {
      const response = await request(app).get('/assets/js/app.js?v=1.0.0')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/assets/js/app.js?v=1.0.0')
    })

    it('normalizes paths that contain /assets but do not start with it', async () => {
      const response = await request(app).get('/case///assets///info')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/assets/info')
    })
  })

  describe('logging', () => {
    it('logs the original URL', async () => {
      await request(app).get('///case///support-roles')

      expect(logger.info).toHaveBeenCalledWith('Request URL parsed', '///case///support-roles', '/case/support-roles')
    })

    it('logs URL normalization when multiple slashes are found', async () => {
      await request(app).get('///case///support-roles?redirect=http://www.example.com')

      expect(logger.info).toHaveBeenCalledWith(
        'Request URL parsed',
        '///case///support-roles?redirect=http://www.example.com',
        '/case/support-roles?redirect=http://www.example.com',
      )
    })

    it('does not log normalization when URL does not need normalization', async () => {
      await request(app).get('/case/support-roles')

      expect(logger.info).not.toHaveBeenCalledWith('Request URL parsed', expect.any(String), expect.any(String))
    })

    it('logs normalization for /assets paths with multiple slashes', async () => {
      await request(app).get('///assets///css///style.css')

      expect(logger.info).toHaveBeenCalledWith(
        'Request URL parsed',
        '///assets///css///style.css',
        '/assets/css/style.css',
      )
    })

    it('does not log normalization for /assets paths that are already normalized', async () => {
      await request(app).get('/assets/css/style.css')

      expect(logger.info).not.toHaveBeenCalledWith('Request URL parsed', expect.any(String), expect.any(String))
    })
  })

  describe('edge cases', () => {
    it('handles root path with empty value', async () => {
      const response = await request(app).get('')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/')
    })

    it('handles root path with single slash', async () => {
      const response = await request(app).get('/')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/')
    })

    it('handles root path with multiple slashes', async () => {
      const response = await request(app).get('///')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/')
    })

    it('handles empty query string', async () => {
      const response = await request(app).get('///case///dashboard?')

      expect(response.status).toBe(200)
      // When query string is empty, it's removed by Express
      expect(response.body.url).toBe('/case/dashboard')
    })

    it('handles URL with only query string', async () => {
      const response = await request(app).get('///?param=value')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/?param=value')
    })

    it('handles URLs with encoded characters', async () => {
      const response = await request(app).get('///case///search?q=test%20query')

      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/search?q=test%20query')
    })
  })
})
