import express, { Request, Response } from 'express'
import request from 'supertest'
import { Server } from 'http'
import setUpReqUrlParser from './setUpReqUrlParser'
import { logger } from '../logger'

jest.mock('../logger', () => ({
  logger: {
    info: jest.fn(),
  },
}))

describe('setUpReqUrlParser', () => {
  let app: express.Express
  let server: Server

  beforeAll(() => {
    app = express()
    app.use(setUpReqUrlParser())

    app.use((req: Request, res: Response) => {
      res.json({ url: req.url })
    })

    server = app.listen(0)
  })

  afterAll(done => {
    server.close(done)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('redirects with 301', () => {
    it('redirects uppercase path to lowercase', async () => {
      const response = await request(server).get('/CASE/dashboard')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/case/dashboard')
    })

    it('redirects mixed case path to lowercase', async () => {
      const response = await request(server).get('/Case/Dashboard')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/case/dashboard')
    })

    it('redirects multiple leading slashes', async () => {
      const response = await request(server).get('///case/DASHBOARD')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/case/dashboard')
    })

    it('redirects multiple consecutive slashes in path', async () => {
      const response = await request(server).get('/case////dashboard')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/case/dashboard')
    })

    it('redirects combined uppercase and multiple slashes', async () => {
      const response = await request(server).get('///CASE////dashboard')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/case/dashboard')
    })

    it('preserves query string on redirect', async () => {
      const response = await request(server).get('/CASE/dashboard?foo=bar')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/case/dashboard?foo=bar')
    })

    it('preserves multiple query parameters on redirect', async () => {
      const response = await request(server).get('/CASE/dashboard?param1=value1&param2=value2')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/case/dashboard?param1=value1&param2=value2')
    })

    it('preserves uppercase query param values on redirect', async () => {
      const response = await request(server).get('/CASE/dashboard?foo=BAR')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/case/dashboard?foo=BAR')
    })

    it('preserves uppercase query param values on redirect, v2', async () => {
      const response = await request(server).get('/CASE/dashboard/?FOO=BAR')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/case/dashboard/?FOO=BAR')
    })

    it('redirects uppercase /assets path', async () => {
      const response = await request(server).get('/assets/CSS/style.css')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/assets/css/style.css')
    })

    it('redirects multiple slashes before /assets', async () => {
      const response = await request(server).get('///assets///css///style.css')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/assets/css/style.css')
    })

    it('redirects multiple slashes before /assets, v2', async () => {
      const response = await request(server).get('///assets///css///style.css?cache=TRUE')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/assets/css/style.css?cache=TRUE')
    })
  })

  describe('no redirect for already normalised paths', () => {
    it('does not redirect a clean lowercase path', async () => {
      const response = await request(server).get('/case/dashboard')
      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/dashboard')
    })

    it('does not redirect root path', async () => {
      const response = await request(server).get('/')
      expect(response.status).toBe(200)
    })

    it('does not redirect a clean path with query string', async () => {
      const response = await request(server).get('/case/dashboard?foo=bar')
      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/dashboard?foo=bar')
    })

    it('does not redirect when only query param values are uppercase', async () => {
      const response = await request(server).get('/case/dashboard?foo=BAR')
      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/dashboard?foo=BAR')
    })

    it('does not redirect a clean /assets path', async () => {
      const response = await request(server).get('/assets/css/style.css')
      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/assets/css/style.css')
    })

    it('does not redirect paths with encoded characters', async () => {
      const response = await request(server).get('/case/search?q=test%20query')
      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/case/search?q=test%20query')
    })
  })

  describe('logging', () => {
    it('logs when a redirect occurs', async () => {
      await request(server).get('///case///dashboard')
      expect(logger.info).toHaveBeenCalledWith('Request URL redirected', '///case///dashboard', '/case/dashboard')
    })

    it('logs the redirect with query string preserved', async () => {
      await request(server).get('///case///dashboard?redirect=http://www.example.com')
      expect(logger.info).toHaveBeenCalledWith(
        'Request URL redirected',
        '///case///dashboard?redirect=http://www.example.com',
        '/case/dashboard?redirect=http://www.example.com',
      )
    })

    it('does not log when no redirect is needed', async () => {
      await request(server).get('/case/dashboard')
      expect(logger.info).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('handles root path', async () => {
      const response = await request(server).get('/')
      expect(response.status).toBe(200)
    })

    it('handles empty query string', async () => {
      const response = await request(server).get('///case///dashboard?')
      expect(response.status).toBe(301)
      expect(response.headers.location).toBe('/case/dashboard')
    })

    it('handles URL with only query string on clean path', async () => {
      const response = await request(server).get('/?param=value')
      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/?param=value')
    })
  })

  describe('security — open redirect prevention', () => {
    it('collapses double-slash prefix to a local path, never an external redirect', async () => {
      const response = await request(server).get('//evil.com/steal')
      expect(response.status).toBe(301)
      expect(response.headers.location).toMatch(/^\/[^/]/) // single leading slash only
      expect(response.headers.location).not.toMatch(/^https?:\/\//)
      expect(response.headers.location).not.toMatch(/^\/\//)
    })

    it('redirect location is always a relative path, never an absolute URL', async () => {
      const response = await request(server).get('/CASE/dashboard')
      expect(response.status).toBe(301)
      expect(response.headers.location).toMatch(/^\/[^/]/)
    })

    it('calls next() without redirecting when URL construction throws due to malformed host', async () => {
      const response = await request(server).get('/CASE/dashboard').set('Host', '[invalid')
      expect(response.status).toBe(200)
      expect(response.body.url).toBe('/CASE/dashboard')
    })
  })
})
