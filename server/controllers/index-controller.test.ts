import { NextFunction, Request, Response } from 'express'
import indexController from './index-controller'

const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

describe('index-controller', () => {
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
    await indexController(req, res, next)
    expect(mockInitialiseBasicAuthentication).toHaveBeenCalledWith(req, res, next)
  })

  it('sets pageTitle, useOneLogin and currentTime then renders index', async () => {
    const { req, res, next } = createReqRes()
    await indexController(req, res, next)
    expect(res.locals.pageTitle).toBe('Home')
    expect(res.locals.useOneLogin).toBe(true)
    expect(res.locals.currentTime).toBeDefined()
    expect(res.render).toHaveBeenCalledWith('pages/index.njk')
  })

  it('calls next(error) when initialiseBasicAuthentication throws', async () => {
    const { req, res, next } = createReqRes()
    const error = new Error('Auth failed')
    mockInitialiseBasicAuthentication.mockRejectedValue(error)
    await indexController(req, res, next)
    expect(next).toHaveBeenCalledWith(error)
  })
})
