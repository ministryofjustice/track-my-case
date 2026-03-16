import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import { CaseDetailsResponse } from '../interfaces/caseDetails'
import { getMockCaseDetailsResponse } from '../services/mock/mock-response'
import courtInformationController from './court-information-controller'
import { HEARING_TYPE, HearingSummary } from '../interfaces/hearingSummary'

// Mocks that must be set up BEFORE importing the controller under test
const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

const mockMapCaseDetailsToHearingSummary = jest.fn()
jest.mock('../mappers/caseDetailsService', () => ({
  __esModule: true,
  mapCaseDetailsToHearingSummary: (...args: unknown[]) => mockMapCaseDetailsToHearingSummary(...args),
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

  const caseUrn = 'CASE123'

  const createReqRes = (overrides?: { req?: Request; res?: Response }) => {
    const req = {
      session: {
        selectedUrn: caseUrn,
      },
      csrfToken: jest.fn().mockReturnValue('csrf-token'),
      ...overrides?.req,
    } as Request

    const res = {
      locals: {
        user: { email: defaultUserEmail },
        selectedUrn: caseUrn,
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

    const caseDetailsResponse: CaseDetailsResponse = getMockCaseDetailsResponse(caseUrn)
    const hearing = caseDetailsResponse.caseDetails.courtSchedule[0].hearings[0]
    const hearingSummary: HearingSummary = {
      hearingOption: 'COURT_SITTINGS',
      hearingType: HEARING_TYPE.TRIAL,
      sittingStart: '01 January 2025, 10:00',
      hearingStartDateMessage: {
        title: '2 months and 22 days',
        description: 'some description',
      },
      sittingEnd: '',
      sittingPeriod: '',
      location: {
        courtHouseName: 'Southwark Crown Court',
        courtRoomName: '',
        addressLines: [],
        postcode: '',
        country: '',
      },
    }

    mockGetCaseDetailsByUrn.mockResolvedValue(caseDetailsResponse)
    mockMapCaseDetailsToHearingSummary.mockReturnValue(hearingSummary)
    mockGetCourtUrl.mockReturnValue('https://example/court')

    await courtInformationController(req, res, next)

    expect(mockInitialiseBasicAuthentication).toHaveBeenCalled()
    expect(mockGetCaseDetailsByUrn).toHaveBeenCalledWith(caseUrn, defaultUserEmail)
    expect(mockMapCaseDetailsToHearingSummary).toHaveBeenCalledWith(hearing)
    expect(mockGetCourtUrl).toHaveBeenCalledWith('Southwark Crown Court')
    expect(res.locals.courtUrl).toBe('https://example/court')
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information')
  })

  it('falls back to default court finder URL when court is not found', async () => {
    const { req, res, next } = createReqRes()

    const caseDetailsResponse: CaseDetailsResponse = getMockCaseDetailsResponse(caseUrn)
    const { caseDetails } = caseDetailsResponse
    const courtSitting = caseDetails.courtSchedule[0].hearings[0].courtSittings[0]
    courtSitting.courtHouse.courtHouseName = 'Unknown Court'
    courtSitting.courtHouse.courtRoom = []
    courtSitting.courtHouse.address = undefined

    mockGetCaseDetailsByUrn.mockResolvedValue(caseDetailsResponse)
    mockMapCaseDetailsToHearingSummary.mockReturnValue({
      location: { courtHouseName: 'Unknown Court' },
    })
    mockGetCourtUrl.mockReturnValue(null)

    await courtInformationController(req, res, next)

    expect(res.locals.courtUrl).toEqual('https://www.find-court-tribunal.service.gov.uk/')
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information')
  })

  it('returns 404 with specific view when there are no hearings allocated', async () => {
    const { req, res, next } = createReqRes()

    const caseDetailsResponse: CaseDetailsResponse = {
      caseDetails: {
        caseUrn: 'CASEURN3',
        courtSchedule: [
          {
            hearings: [],
          },
        ],
      },
      statusCode: 200,
    }

    mockGetCaseDetailsByUrn.mockResolvedValue(caseDetailsResponse)

    await courtInformationController(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information-no-hearings-allocated', {
      error: 'No hearings allocated for this case',
    })
  })

  it('returns 404 not found view when caseDetails is null', async () => {
    const { req, res, next } = createReqRes()
    mockGetCaseDetailsByUrn.mockResolvedValue({ statusCode: 404 })

    await courtInformationController(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information-not-found')
  })

  it('returns 404 not found view when courtSchedule is empty', async () => {
    const { req, res, next } = createReqRes()
    mockGetCaseDetailsByUrn.mockResolvedValue({
      caseDetails: { courtSchedule: [] },
      statusCode: 200,
    })

    await courtInformationController(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information-not-found')
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
    expect(res.render).toHaveBeenCalledWith('pages/case/court-information-not-found')

    consoleErrorSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  it('redirects to search when case not confirmed', async () => {
    const { req, res, next } = createReqRes({
      res: { locals: { user: { email: defaultUserEmail } } } as Response,
    })

    // Remove selectedUrn from res.locals to trigger redirect
    res.locals.selectedUrn = undefined

    await courtInformationController(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith(paths.CASES.SEARCH)
  })

  describe('reserved service error constants (mapOfReservedServiceErrors)', () => {
    it('returns 404 and renders court-information-not-found when URN is NOTFOUND', async () => {
      const { req, res, next } = createReqRes()
      res.locals.selectedUrn = 'NOTFOUND'

      await courtInformationController(req, res, next)

      expect(mockGetCaseDetailsByUrn).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.locals.pageTitle).toBe('Court information - Not found')
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-not-found')
    })

    it('returns 404 and renders court-information-not-found when URN is BADREQUEST (400)', async () => {
      const { req, res, next } = createReqRes()
      res.locals.selectedUrn = 'BADREQUEST'

      await courtInformationController(req, res, next)

      expect(mockGetCaseDetailsByUrn).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.locals.pageTitle).toBe('Court information - Bad request')
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-not-found')
    })

    it('returns 403 and renders court-information-access-denied when URN is DENIED', async () => {
      const { req, res, next } = createReqRes()
      res.locals.selectedUrn = 'DENIED'

      await courtInformationController(req, res, next)

      expect(mockGetCaseDetailsByUrn).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.locals.pageTitle).toBe('Court information - Access denied')
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-access-denied')
    })

    it('returns 429 and renders court-information-common-platform-unavailable when URN is TOOMANY', async () => {
      const { req, res, next } = createReqRes()
      res.locals.selectedUrn = 'TOOMANY'

      await courtInformationController(req, res, next)

      expect(mockGetCaseDetailsByUrn).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(429)
      expect(res.locals.pageTitle).toBe('Court information - Too many requests')
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-common-platform-unavailable')
    })

    it('returns 503 and renders court-information-common-platform-unavailable when URN is SERVICEDOWN', async () => {
      const { req, res, next } = createReqRes()
      res.locals.selectedUrn = 'SERVICEDOWN'

      await courtInformationController(req, res, next)

      expect(mockGetCaseDetailsByUrn).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(503)
      expect(res.locals.pageTitle).toBe('Court information - Common platform unavailable')
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-common-platform-unavailable')
    })

    it('treats reserved error URNs case-insensitively (e.g. denied -> DENIED)', async () => {
      const { req, res, next } = createReqRes()
      res.locals.selectedUrn = 'denied'

      await courtInformationController(req, res, next)

      expect(mockGetCaseDetailsByUrn).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-access-denied')
    })
  })

  describe('API response error status codes', () => {
    it('returns 403 and renders court-information-access-denied when API returns 403', async () => {
      const { req, res, next } = createReqRes()
      mockGetCaseDetailsByUrn.mockResolvedValue({
        statusCode: 403,
        message: 'Access denied',
      })

      await courtInformationController(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.locals.pageTitle).toBe('Court information - Access denied')
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-access-denied')
    })

    it('returns 429 and renders court-information-common-platform-unavailable when API returns 429', async () => {
      const { req, res, next } = createReqRes()
      mockGetCaseDetailsByUrn.mockResolvedValue({
        statusCode: 429,
        message: 'Too many requests',
      })

      await courtInformationController(req, res, next)

      expect(res.status).toHaveBeenCalledWith(429)
      expect(res.locals.pageTitle).toBe('Court information - Too many requests')
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-common-platform-unavailable')
    })

    it('returns 503 and renders court-information-common-platform-unavailable when API returns 503', async () => {
      const { req, res, next } = createReqRes()
      mockGetCaseDetailsByUrn.mockResolvedValue({
        statusCode: 503,
        message: 'Service down',
      })

      await courtInformationController(req, res, next)

      expect(res.status).toHaveBeenCalledWith(503)
      expect(res.locals.pageTitle).toBe('Court information - Common platform unavailable')
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-common-platform-unavailable')
    })

    it('returns 400 and renders court-information-not-found when API returns 400', async () => {
      const { req, res, next } = createReqRes()
      mockGetCaseDetailsByUrn.mockResolvedValue({
        statusCode: 400,
        message: 'Bad request',
      })

      await courtInformationController(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.locals.pageTitle).toBe('Court information - Bad request')
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-not-found')
    })

    it('returns 404 and renders court-information-not-found for unexpected status code (e.g. 500)', async () => {
      const { req, res, next } = createReqRes()
      mockGetCaseDetailsByUrn.mockResolvedValue({
        statusCode: 500,
        message: 'Internal Server Error',
      })

      await courtInformationController(req, res, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.locals.pageTitle).toBe('Court information - Not found')
      expect(res.locals.message).toContain('unexpected status code')
      expect(res.render).toHaveBeenCalledWith('pages/case/court-information-not-found')
    })
  })
})
