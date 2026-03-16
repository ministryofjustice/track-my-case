import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import signedOutController from './signed-out-controller'

const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

describe('signed-out-controller', () => {
  const createReqRes = () => {
    const req = {} as Request
    const res = {
      locals: {} as Record<string, unknown>,
      redirect: jest.fn(),
    } as unknown as Response
    const next = jest.fn() as NextFunction
    return { req, res, next }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls initialiseBasicAuthentication', async () => {
    const { req, res, next } = createReqRes()
    await signedOutController(req, res, next)
    expect(mockInitialiseBasicAuthentication).toHaveBeenCalledWith(req, res, next)
  })

  it('sets pageTitle and redirects to START', async () => {
    const { req, res, next } = createReqRes()
    await signedOutController(req, res, next)
    expect(res.locals.pageTitle).toBe('Signed out')
    expect(res.redirect).toHaveBeenCalledWith(paths.START)
  })

  it('calls next(error) when an error is thrown', async () => {
    const { req, res, next } = createReqRes()
    const error = new Error('Auth failed')
    mockInitialiseBasicAuthentication.mockRejectedValue(error)
    await signedOutController(req, res, next)
    expect(next).toHaveBeenCalledWith(error)
  })
})
