import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import witnessServiceController from './witness-service-controller'

const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

describe('witness-service-controller', () => {
  const createReqRes = () => {
    const req = {} as Request
    const res = {
      locals: {} as Record<string, unknown>,
      render: jest.fn(),
    } as unknown as Response
    const next = jest.fn() as NextFunction
    return { req, res, next }
  }

  beforeEach(() => jest.clearAllMocks())

  it('calls initialiseBasicAuthentication', async () => {
    const { req, res, next } = createReqRes()
    await witnessServiceController(req, res, next)
    expect(mockInitialiseBasicAuthentication).toHaveBeenCalledWith(req, res, next)
  })

  it('sets pageTitle and backLink then renders witness-service', async () => {
    const { req, res, next } = createReqRes()
    await witnessServiceController(req, res, next)
    expect(res.locals.pageTitle).toBe('Get support giving evidence as a witness')
    expect(res.locals.backLink).toBe(paths.CASES.DASHBOARD)
    expect(res.render).toHaveBeenCalledWith('pages/case/witness-service')
  })

  it('calls next(error) when an error is thrown', async () => {
    const { req, res, next } = createReqRes()
    mockInitialiseBasicAuthentication.mockRejectedValue(new Error('Auth failed'))
    await witnessServiceController(req, res, next)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})
