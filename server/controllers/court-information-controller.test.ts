import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import { CaseDetails } from '../interfaces/caseDetails'
import { getMockCaseDetails } from '../services/mock/mock-response'
import courtInformationController from './court-information-controller'

// Mocks that must be set up BEFORE importing the controller under test
const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

const mockMapCaseDetailsToHearingSummary = jest.fn()
jest.mock('../mappers/mapCaseDetailsToHearingSummary', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockMapCaseDetailsToHearingSummary(...args),
}))

const mockGetCourtUrl = jest.fn()
jest.mock('../constants/courts', () => ({
  __esModule: true,
  default: {
    getCourtUrl: (...args: unknown[]) => mockGetCourtUrl(...args),
  },
}))

let mockGetCaseDetailsByUrn: jest.Mock
jest.mock('../services/courtHearingService', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        getCaseDetailsByUrn: (...args: unknown[]) => mockGetCaseDetailsByUrn(...args),
      }
    }),
  }
})

describe('court-information-controller', () => {
  const defaultUserEmail = 'user@example.com'

  const createReqRes = (overrides?: { req?: Request; res?: Response }) => {
    const req = {
      session: {
        selectedUrn: 'CASE123',
        caseConfirmed: true,
      },
      csrfToken: jest.fn().mockReturnValue('csrf-token'),
      ...overrides?.req,
    } as Request

    const res = {
      locals: {
        user: { email: defaultUserEmail },
      },
      redirect: jest.fn(),
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      ...overrides?.res,
    } as Response

    const next = jest.fn() as NextFunction
    return { req, res, next }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCaseDetailsByUrn = jest.fn()
  })

  it('renders court information when case has hearings and court URL is found', async () => {
    const { req, res, next } = createReqRes()

    const caseDetails: CaseDetails = getMockCaseDetails()
    const hearingSummary = {
      hearingType: 'Trial',
      dateTime: '01 January 2025, 10:00',
      location: { courtHouseName: 'Southwark Crown Court' },
    }

    mockGetCaseDetailsByUrn.mockResolvedValue(caseDetails)
    mockMapCaseDetailsToHearingSummary.mockReturnValue(hearingSummary)
    mockGetCourtUrl.mockReturnValue('https://example/court')

    await courtInformationController(req, res, next)

    expect(mockInitialiseBasicAuthentication).toHaveBeenCalled()
    expect(mockGetCaseDetailsByUrn).toHaveBeenCalledWith('CASE123', defaultUserEmail)
    expect(mockMapCaseDetailsToHearingSummary).toHaveBeenCalledWith(caseDetails)
    expect(mockGetCourtUrl).toHaveBeenCalledWith('Southwark Crown Court')
    expect(res.locals.courtUrl).toBe('https://example/court')
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information')
  })

  it('falls back to default court finder URL when court is not found', async () => {
    const { req, res, next } = createReqRes()

    const caseDetails: CaseDetails = getMockCaseDetails()
    const courtSitting = caseDetails.courtSchedule[0].hearings[0].courtSittings[0]
    courtSitting.courtHouse.courtHouseName = 'Unknown Court'
    courtSitting.courtHouse.courtRoom = []
    courtSitting.courtHouse.address = undefined

    mockGetCaseDetailsByUrn.mockResolvedValue(caseDetails)
    mockMapCaseDetailsToHearingSummary.mockReturnValue({
      location: { courtHouseName: 'Unknown Court' },
    })
    mockGetCourtUrl.mockReturnValue(null)

    await courtInformationController(req, res, next)

    expect(res.locals.courtUrl).toBe('https://www.find-court-tribunal.service.gov.uk/')
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information')
  })

  it('returns 404 with specific view when there are no hearings allocated', async () => {
    const { req, res, next } = createReqRes()

    const caseDetails: CaseDetails = {
      courtSchedule: [
        {
          hearings: [],
        },
      ],
    }

    mockGetCaseDetailsByUrn.mockResolvedValue(caseDetails)

    await courtInformationController(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information-no-hearings-allocated', {
      error: 'No hearings allocated for this case',
    })
  })

  it('returns 404 not found view when caseDetails is null', async () => {
    const { req, res, next } = createReqRes()
    mockGetCaseDetailsByUrn.mockResolvedValue(null)

    await courtInformationController(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information-not-found', {
      error: 'Case could not be found',
    })
  })

  it('returns 404 not found view when courtSchedule is empty', async () => {
    const { req, res, next } = createReqRes()
    mockGetCaseDetailsByUrn.mockResolvedValue({ courtSchedule: [] })

    await courtInformationController(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information-not-found', {
      error: 'Case could not be found',
    })
  })

  it('handles exceptions from service by rendering 404 not found', async () => {
    const { req, res, next } = createReqRes()
    const error = { status: 500, message: 'mocked message' }
    mockGetCaseDetailsByUrn.mockRejectedValue(error)

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined)

    await courtInformationController(req, res, next)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Status 500, mocked message')
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information-not-found', {
      error: 'Case could not be found',
    })

    consoleErrorSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  it('redirects to search when case not confirmed', async () => {
    const { req, res, next } = createReqRes({
      req: { session: { selectedUrn: 'CASE123', caseConfirmed: false } } as Request,
    })

    // Even though controller does not return after redirect, we only assert the redirect here
    mockGetCaseDetailsByUrn.mockResolvedValue(null)

    await courtInformationController(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith(paths.CASES.SEARCH)
  })
})
