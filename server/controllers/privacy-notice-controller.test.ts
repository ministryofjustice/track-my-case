import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import privacyNoticeController from './privacy-notice-controller'

const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

describe('privacy-notice-controller', () => {
  const createReqRes = (overrides?: { authenticated?: boolean; referer?: string }) => {
    const req = {
      headers: { referer: overrides?.referer },
    } as Request
    const res = {
      locals: { authenticated: overrides?.authenticated ?? false } as Record<string, unknown>,
      render: jest.fn(),
    } as unknown as Response
    const next = jest.fn() as NextFunction
    return { req, res, next }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls initialiseBasicAuthentication', async () => {
    const { req, res, next } = createReqRes()
    await privacyNoticeController(req, res, next)
    expect(mockInitialiseBasicAuthentication).toHaveBeenCalledWith(req, res, next)
  })

  it('sets pageTitle and renders privacy-notice', async () => {
    const { req, res, next } = createReqRes()
    await privacyNoticeController(req, res, next)
    expect(res.locals.pageTitle).toBe('Privacy notice')
    expect(res.render).toHaveBeenCalledWith('pages/privacy-notice')
  })

  it('sets backLink to START when not authenticated', async () => {
    const { req, res, next } = createReqRes({ authenticated: false })
    await privacyNoticeController(req, res, next)
    expect(res.locals.backLink).toBe(paths.START)
  })

  it('sets backLink to START when authenticated and referer is START', async () => {
    const { req, res, next } = createReqRes({
      authenticated: true,
      referer: `http://localhost${paths.START}`,
    })
    await privacyNoticeController(req, res, next)
    expect(res.locals.backLink).toBe(paths.START)
  })

  it('sets backLink to DASHBOARD when authenticated and referer is not START', async () => {
    const { req, res, next } = createReqRes({
      authenticated: true,
      referer: 'http://localhost/case/dashboard',
    })
    await privacyNoticeController(req, res, next)
    expect(res.locals.backLink).toBe(paths.CASES.DASHBOARD)
  })

  it('calls next(error) when an error is thrown', async () => {
    const { req, res, next } = createReqRes()
    const error = new Error('Auth failed')
    mockInitialiseBasicAuthentication.mockRejectedValue(error)
    await privacyNoticeController(req, res, next)
    expect(next).toHaveBeenCalledWith(error)
  })
})
