import { NextFunction, Request, Response } from 'express'
import caseDashboardController from './case-dashboard-controller'

const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

describe('case-dashboard-controller', () => {
  const createReqRes = () => {
    const req = {} as Request
    const res = {
      locals: {} as Record<string, unknown>,
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
    await caseDashboardController(req, res, next)
    expect(mockInitialiseBasicAuthentication).toHaveBeenCalledWith(req, res, next)
  })

  it('sets pageTitle and backLink then renders dashboard', async () => {
    const { req, res, next } = createReqRes()
    await caseDashboardController(req, res, next)
    expect(res.locals.pageTitle).toBe('Dashboard')
    expect(res.locals.backLink).toBe('/')
    expect(res.render).toHaveBeenCalledWith('pages/case/dashboard.njk')
  })

  it('calls next(error) when an error is thrown', async () => {
    const { req, res, next } = createReqRes()
    const error = new Error('Auth failed')
    mockInitialiseBasicAuthentication.mockRejectedValue(error)
    await caseDashboardController(req, res, next)
    expect(next).toHaveBeenCalledWith(error)
  })
})
