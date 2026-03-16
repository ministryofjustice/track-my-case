import { NextFunction, Request, Response } from 'express'
import feedbackDecisionController from './feedback-decision-controller'

const mockPageFeedbackTotalInc = jest.fn()
jest.mock('../services/prometheusService', () => ({
  pageFeedbackTotal: {
    inc: (...args: unknown[]) => mockPageFeedbackTotalInc(...args),
  },
}))

describe('feedback-decision-controller', () => {
  const createReqRes = (body?: { pageUseful?: string; pageUrl?: string; pageTitle?: string }) => {
    const req = { body: body ?? {} } as Request
    const res = {
      sendStatus: jest.fn(),
    } as unknown as Response
    const next = jest.fn() as NextFunction
    return { req, res, next }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('increments feedback with Yes when pageUseful is yes and sends 204', async () => {
    const { req, res, next } = createReqRes({
      pageUseful: 'yes',
      pageUrl: '/case/dashboard',
      pageTitle: 'Dashboard',
    })
    await feedbackDecisionController(req, res, next)
    expect(mockPageFeedbackTotalInc).toHaveBeenCalledWith({
      page: 'Dashboard (/case/dashboard)',
      useful: 'Yes',
    })
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('increments feedback with No when pageUseful is not yes and sends 204', async () => {
    const { req, res, next } = createReqRes({
      pageUseful: 'no',
      pageUrl: '/case/search',
      pageTitle: 'Find your court',
    })
    await feedbackDecisionController(req, res, next)
    expect(mockPageFeedbackTotalInc).toHaveBeenCalledWith({
      page: 'Find your court (/case/search)',
      useful: 'No',
    })
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('treats pageUseful case-insensitively', async () => {
    const { req, res, next } = createReqRes({
      pageUseful: 'YES',
      pageTitle: 'Home',
      pageUrl: '/',
    })
    await feedbackDecisionController(req, res, next)
    expect(mockPageFeedbackTotalInc).toHaveBeenCalledWith({
      page: 'Home (/)',
      useful: 'Yes',
    })
  })

  it('truncates page label when over 200 characters', async () => {
    const longTitle = 'A'.repeat(250)
    const { req, res, next } = createReqRes({
      pageUseful: 'yes',
      pageTitle: longTitle,
      pageUrl: '/page',
    })
    await feedbackDecisionController(req, res, next)
    const callArg = mockPageFeedbackTotalInc.mock.calls[0][0]
    expect(callArg.page.length).toBeLessThanOrEqual(200)
    expect(callArg.page.endsWith('...')).toBe(true)
  })

  it('calls next(err) when an error is thrown', async () => {
    const { req, res, next } = createReqRes({ pageUseful: 'yes' })
    mockPageFeedbackTotalInc.mockImplementation(() => {
      throw new Error('Prometheus error')
    })
    await feedbackDecisionController(req, res, next)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})
