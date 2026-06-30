import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import specialMeasuresController from './special-measures-controller'

const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

describe('special-measures-controller', () => {
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
    await specialMeasuresController(req, res, next)
    expect(mockInitialiseBasicAuthentication).toHaveBeenCalledWith(req, res, next)
  })

  it('sets pageTitle and backLink then renders special-measures', async () => {
    const { req, res, next } = createReqRes()
    await specialMeasuresController(req, res, next)
    expect(res.locals.pageTitle).toBe('Special measures')
    expect(res.locals.backLink).toBe(paths.CASES.DASHBOARD)
    expect(res.render).toHaveBeenCalledWith('pages/case/special-measures')
  })

  it('calls next(error) when an error is thrown', async () => {
    const { req, res, next } = createReqRes()
    mockInitialiseBasicAuthentication.mockRejectedValue(new Error('Auth failed'))
    await specialMeasuresController(req, res, next)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})
