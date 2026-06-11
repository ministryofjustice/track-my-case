import { NextFunction, Request, Response } from 'express'
import createErrorHandler from './errorHandler'
import { logger } from './logger'

jest.mock('./logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}))

jest.mock('./config', () => ({
  __esModule: true,
  default: {
    serviceUrl: 'https://some-domain.com',
  },
}))

const createReqRes = (overrides: Partial<Request> = {}) => {
  const req = {
    originalUrl: '/some-path',
    method: 'POST',
    headers: {},
    id: 'req-123',
    ...overrides,
  } as unknown as Request

  const res = {
    locals: {},
    status: jest.fn().mockReturnThis(),
    redirect: jest.fn(),
    render: jest.fn(),
  } as unknown as Response

  const next = jest.fn() as NextFunction

  return { req, res, next }
}

describe('createErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('CSRF token error (EBADCSRFTOKEN)', () => {
    const csrfError = Object.assign(new Error('invalid csrf token'), { code: 'EBADCSRFTOKEN' })

    it('redirects to referer when present', () => {
      const { req, res, next } = createReqRes({
        originalUrl: '/private-beta-sign-in',
        method: 'POST',
        headers: { referer: 'http://localhost:9999/private-beta-sign-in' },
      })

      createErrorHandler(false)(csrfError, req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('http://localhost:9999/private-beta-sign-in')
    })

    it('redirects to originalUrl when referer is absent', () => {
      const { req, res, next } = createReqRes({
        originalUrl: '/private-beta-sign-in',
        method: 'POST',
        headers: {},
      })

      createErrorHandler(false)(csrfError, req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('/private-beta-sign-in')
    })

    it('logs a warning, not an error', () => {
      const { req, res, next } = createReqRes({
        originalUrl: '/private-beta-sign-in',
        method: 'POST',
      })

      createErrorHandler(false)(csrfError, req, res, next)

      expect(logger.warn).toHaveBeenCalledWith('CSRF token invalid for: POST /private-beta-sign-in')
      expect(logger.error).not.toHaveBeenCalled()
    })

    it('does not render the error page', () => {
      const { req, res, next } = createReqRes()

      createErrorHandler(false)(csrfError, req, res, next)

      expect(res.render).not.toHaveBeenCalled()
    })
  })

  describe('OIDC session lost error', () => {
    const oidcError = new Error('did not find expected authorization request details in session')

    it('redirects to sign-in when OIDC callback session is lost', () => {
      const { req, res, next } = createReqRes({
        originalUrl: '/oidc/authorization-code/callback',
      })

      createErrorHandler(false)(oidcError, req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('https://some-domain.com/sign-in')
    })

    it('logs a warning for the OIDC session loss', () => {
      const { req, res, next } = createReqRes({
        originalUrl: '/oidc/authorization-code/callback',
      })

      createErrorHandler(false)(oidcError, req, res, next)

      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('OIDC callback failed'))
    })

    it('does not redirect to sign-in for OIDC error on a non-callback URL', () => {
      const { req, res, next } = createReqRes({
        originalUrl: '/some-other-path',
      })

      createErrorHandler(false)(oidcError, req, res, next)

      expect(res.redirect).not.toHaveBeenCalledWith('https://some-domain.com/sign-in')
    })
  })

  describe('401/403 HTTP errors', () => {
    it('redirects to /sign-out on 401', () => {
      const { req, res, next } = createReqRes()
      const error = Object.assign(new Error('Unauthorized'), { status: 401 })

      createErrorHandler(false)(error, req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('/sign-out')
      expect(logger.info).toHaveBeenCalledWith('Logging user out')
    })

    it('redirects to /sign-out on 403', () => {
      const { req, res, next } = createReqRes()
      const error = Object.assign(new Error('Forbidden'), { status: 403 })

      createErrorHandler(false)(error, req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('/sign-out')
      expect(logger.info).toHaveBeenCalledWith('Logging user out')
    })
  })

  describe('generic errors', () => {
    it('renders error page with error message in non-production', () => {
      const { req, res, next } = createReqRes()
      const error = Object.assign(new Error('Something broke'), { status: 500 })

      createErrorHandler(false)(error, req, res, next)

      expect(res.locals.message).toBe('Something broke')
      expect(res.locals.status).toBe(500)
      expect(res.locals.stack).toBe(error.stack)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.render).toHaveBeenCalledWith('pages/error')
    })

    it('renders error page with generic message in production', () => {
      const { req, res, next } = createReqRes()
      const error = Object.assign(new Error('Something broke'), { status: 500 })

      createErrorHandler(true)(error, req, res, next)

      expect(res.locals.message).toBe('Something went wrong. The error has been logged. Please try again')
      expect(res.locals.stack).toBeNull()
      expect(res.render).toHaveBeenCalledWith('pages/error')
    })

    it('defaults to 500 status when error has no status', () => {
      const { req, res, next } = createReqRes()
      const error = new Error('Unknown error')

      createErrorHandler(false)(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.render).toHaveBeenCalledWith('pages/error')
    })

    it('logs the error', () => {
      const { req, res, next } = createReqRes({ originalUrl: '/case/something' })
      const error = new Error('Oops')

      createErrorHandler(false)(error, req, res, next)

      expect(logger.error).toHaveBeenCalledWith('Error handling request for: /case/something', error)
    })
  })
})
