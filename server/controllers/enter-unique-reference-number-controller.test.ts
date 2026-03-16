import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import { UP } from '../constants/healthStatus'
import {
  getEnterUniqueReferenceNumber,
  isWithinOngoingMaintenanceWindow,
  isWithinUpcomingMaintenanceWindow,
  parseNowQueryParam,
  postEnterUniqueReferenceNumber,
} from './enter-unique-reference-number-controller'

const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

let mockGetServiceHealth: jest.Mock
jest.mock('../services/healthService', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getServiceHealth: (...args: unknown[]) => mockGetServiceHealth(...args),
  })),
}))

const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

beforeEach(() => {
  consoleErrorSpy.mockClear()
  mockGetServiceHealth = jest.fn()
})

afterAll(() => {
  consoleErrorSpy.mockRestore()
})

describe('parseNowQueryParam', () => {
  it('returns undefined when value is undefined', () => {
    expect(parseNowQueryParam(undefined)).toBeUndefined()
  })

  it('returns undefined when value is null', () => {
    expect(parseNowQueryParam(null as unknown as string)).toBeUndefined()
  })

  it('returns undefined when value is empty string', () => {
    expect(parseNowQueryParam('')).toBeUndefined()
  })

  it('returns undefined when value is whitespace only', () => {
    expect(parseNowQueryParam('   ')).toBeUndefined()
  })

  it('returns undefined when value is invalid date string', () => {
    expect(parseNowQueryParam('not-a-date')).toBeUndefined()
    expect(parseNowQueryParam('2026-13-45')).toBeUndefined()
  })

  it('returns Date when value is valid ISO string', () => {
    const result = parseNowQueryParam('2026-02-14T12:00:00.000Z')
    expect(result).toBeInstanceOf(Date)
    expect(result?.toISOString()).toBe('2026-02-14T12:00:00.000Z')
  })

  it('returns Date when value is valid date string with spaces', () => {
    const result = parseNowQueryParam('  2026-02-15T10:30:00  ')
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2026)
    expect(result?.getMonth()).toBe(1)
    expect(result?.getDate()).toBe(15)
  })

  it('returns undefined when value is timestamp string', () => {
    const date = new Date('2026-02-14T14:00:00Z')
    const result = parseNowQueryParam(String(date.getTime()))
    expect(result?.getTime()).toBeUndefined()
  })
})

describe('isWithinUpcomingMaintenanceWindow', () => {
  // Week of Sunday 08/03/2026: Sun 08, Mon 09, Tue 10, Wed 11, Thu 12, Fri 13, Sat 14

  it('returns false for Sunday', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-08T12:00:00'))).toBe(false)
  })

  it('returns false for Monday through Thursday', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-09T15:00:00'))).toBe(false) // Mon
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-10T15:00:00'))).toBe(false) // Tue
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-11T15:00:00'))).toBe(false) // Wed
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-12T15:00:00'))).toBe(false) // Thu
  })

  it('returns false for Friday before 12:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-13T11:59:59'))).toBe(false)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-13T11:59'))).toBe(false)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-13T00:00:00'))).toBe(false)
  })

  it('returns true for Friday at 12:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-13T12:00:00'))).toBe(true)
  })

  it('returns true for Friday after 12:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-13T12:00:00'))).toBe(true)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-13T12:00'))).toBe(true)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-13T12:01:00'))).toBe(true)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-13T23:59:59'))).toBe(true)
  })

  it('returns true for Saturday before 18:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-14T00:00:00'))).toBe(true)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-14T17:59:59'))).toBe(true)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-14T17:59'))).toBe(true)
  })

  it('returns false for Saturday at 18:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-14T18:00:00'))).toBe(false)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-14T18:00'))).toBe(false)
  })

  it('returns false for Saturday after 18:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-14T18:01:00'))).toBe(false)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2026-03-14T23:59:59'))).toBe(false)
  })
})

describe('isWithinOngoingMaintenanceWindow', () => {
  // Week of Sunday 08/03/2026: Sun 08, Mon 09, Tue 10, Wed 11, Thu 12, Fri 13, Sat 14
  // Window: Saturday 18:00 - Sunday 13:00 (end exclusive)

  it('returns true for Sunday before 13:00', () => {
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-08T00:00:00'))).toBe(true)
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-08T12:59:59'))).toBe(true)
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-08T12:59'))).toBe(true)
  })

  it('returns false for Sunday at 13:00', () => {
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-08T13:00:00'))).toBe(false)
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-08T13:00'))).toBe(false)
  })

  it('returns false for Sunday after 13:00', () => {
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-08T13:01:00'))).toBe(false)
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-08T23:59:59'))).toBe(false)
  })

  it('returns false for Monday through Thursday', () => {
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-09T15:00:00'))).toBe(false) // Mon
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-10T15:00:00'))).toBe(false) // Tue
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-11T15:00:00'))).toBe(false) // Wed
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-12T15:00:00'))).toBe(false) // Thu
  })

  it('returns false for Friday', () => {
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-13T12:00:00'))).toBe(false)
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-13T23:59:59'))).toBe(false)
  })

  it('returns false for Saturday before 18:00', () => {
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-14T00:00:00'))).toBe(false)
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-14T17:59:59'))).toBe(false)
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-14T17:59'))).toBe(false)
  })

  it('returns true for Saturday at 18:00', () => {
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-14T18:00:00'))).toBe(true)
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-14T18:00'))).toBe(true)
  })

  it('returns true for Saturday after 18:00', () => {
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-14T18:01:00'))).toBe(true)
    expect(isWithinOngoingMaintenanceWindow(new Date('2026-03-14T23:59:59'))).toBe(true)
  })
})

describe('getEnterUniqueReferenceNumber', () => {
  const createReqRes = (overrides?: { session?: Request['session']; query?: Request['query'] }) => {
    const req = {
      session: {},
      query: {},
      ...overrides,
    } as Request
    const res = {
      locals: {} as Record<string, unknown>,
      render: jest.fn(),
    } as unknown as Response
    const next = jest.fn() as NextFunction
    return { req, res, next }
  }

  it('calls initialiseBasicAuthentication', async () => {
    const { req, res, next } = createReqRes()
    mockGetServiceHealth.mockResolvedValue({ status: UP })

    await getEnterUniqueReferenceNumber(req, res, next)

    expect(mockInitialiseBasicAuthentication).toHaveBeenCalledWith(req, res, next)
  })

  it('renders enter-unique-reference-number when service is UP', async () => {
    const { req, res, next } = createReqRes()
    mockGetServiceHealth.mockResolvedValue({ status: UP })

    await getEnterUniqueReferenceNumber(req, res, next)

    expect(res.locals.pageTitle).toBe('Find your court')
    expect(res.locals.backLink).toBe(paths.CASES.DASHBOARD)
    expect(res.render).toHaveBeenCalledWith('pages/case/enter-unique-reference-number.njk')
  })

  it('renders service-error when service is not UP', async () => {
    const { req, res, next } = createReqRes()
    mockGetServiceHealth.mockResolvedValue({ status: 'DOWN', reason: 'Service unavailable' })

    await getEnterUniqueReferenceNumber(req, res, next)

    expect(res.locals.pageTitle).toBe('Service unavailable')
    expect(res.render).toHaveBeenCalledWith('pages/case/service-error.njk')
  })

  it('sets errorList and selectedUrn from session formState when present', async () => {
    const { req, res, next } = createReqRes({
      session: {
        formState: {
          caseSelect: {
            errors: [{ text: 'Enter your unique reference number', href: '#selectedUrn' }],
            formData: { selectedUrn: 'CASE123' },
          },
        },
      },
    })
    mockGetServiceHealth.mockResolvedValue({ status: UP })

    await getEnterUniqueReferenceNumber(req, res, next)

    expect(res.locals.errorList).toEqual([{ text: 'Enter your unique reference number', href: '#selectedUrn' }])
    expect(res.locals.selectedUrn).toBe('CASE123')
    expect(res.render).toHaveBeenCalledWith('pages/case/enter-unique-reference-number.njk')
  })

  it('does not set selectedUrn when formState has no formData selectedUrn', async () => {
    const { req, res, next } = createReqRes({
      session: {
        formState: {
          caseSelect: {
            errors: [],
            formData: {},
          },
        },
      },
    })
    res.locals.selectedUrn = 'existing'
    mockGetServiceHealth.mockResolvedValue({ status: UP })

    await getEnterUniqueReferenceNumber(req, res, next)

    expect(res.locals.selectedUrn).toBeUndefined()
  })

  it('sets ongoingMaintenance and upcomingMaintenance from ?now= query when provided', async () => {
    const { req, res, next } = createReqRes({
      query: { now: '2026-03-14T18:30:00Z' }, // Saturday 18:30 = ongoing maintenance
    })
    mockGetServiceHealth.mockResolvedValue({ status: UP })

    await getEnterUniqueReferenceNumber(req, res, next)

    expect(res.locals.ongoingMaintenance).toBe(true)
    expect(res.locals.upcomingMaintenance).toBe(false)
  })

  it('renders service-error on exception', async () => {
    const { req, res, next } = createReqRes()
    mockGetServiceHealth.mockRejectedValue(new Error('Health check failed'))

    await getEnterUniqueReferenceNumber(req, res, next)

    expect(res.locals.pageTitle).toBe('Service unavailable')
    expect(res.render).toHaveBeenCalledWith('pages/case/service-error.njk')
  })
})

describe('postEnterUniqueReferenceNumber', () => {
  const createReqRes = (body: { selectedUrn?: string }) => {
    const req = {
      body,
      session: {} as Request['session'],
    } as Request
    const res = {
      redirect: jest.fn(),
    } as unknown as Response
    const next = jest.fn() as NextFunction
    return { req, res, next }
  }

  it('redirects to court information and sets session.selectedUrn when URN is valid', async () => {
    const { req, res, next } = createReqRes({ selectedUrn: 'ABC123' })

    await postEnterUniqueReferenceNumber(req, res, next)

    expect(req.session.selectedUrn).toBe('ABC123')
    expect(req.session.formState?.caseSelect).toBeUndefined()
    expect(res.redirect).toHaveBeenCalledWith(paths.CASES.COURT_INFORMATION)
  })

  it('accepts 11-character alphanumeric URN', async () => {
    const { req, res, next } = createReqRes({ selectedUrn: 'a1b2c3d4e56' })

    await postEnterUniqueReferenceNumber(req, res, next)

    expect(req.session.selectedUrn).toBe('a1b2c3d4e56')
    expect(res.redirect).toHaveBeenCalledWith(paths.CASES.COURT_INFORMATION)
  })

  it('redirects to search and saves form state when selectedUrn is empty', async () => {
    const { req, res, next } = createReqRes({ selectedUrn: '' })

    await postEnterUniqueReferenceNumber(req, res, next)

    expect(req.session.formState?.caseSelect?.errors).toEqual([
      { text: 'Enter your unique reference number', href: '#selectedUrn' },
    ])
    expect(req.session.formState?.caseSelect?.formData).toEqual({ selectedUrn: '' })
    expect(res.redirect).toHaveBeenCalledWith(paths.CASES.SEARCH)
  })

  it('redirects to search and saves form state when selectedUrn is whitespace only', async () => {
    const { req, res, next } = createReqRes({ selectedUrn: '   ' })

    await postEnterUniqueReferenceNumber(req, res, next)

    expect(req.session.formState?.caseSelect?.errors).toEqual([
      { text: 'Enter your unique reference number', href: '#selectedUrn' },
    ])
    expect(res.redirect).toHaveBeenCalledWith(paths.CASES.SEARCH)
  })

  it('redirects to search when selectedUrn exceeds 11 characters', async () => {
    const { req, res, next } = createReqRes({ selectedUrn: '123456789012' })

    await postEnterUniqueReferenceNumber(req, res, next)

    expect(req.session.formState?.caseSelect?.errors).toEqual([
      { text: 'Enter your unique reference number in the correct format', href: '#selectedUrn' },
    ])
    expect(res.redirect).toHaveBeenCalledWith(paths.CASES.SEARCH)
  })

  it('redirects to search when selectedUrn contains invalid characters', async () => {
    const { req, res, next } = createReqRes({ selectedUrn: 'ABC-123' })

    await postEnterUniqueReferenceNumber(req, res, next)

    expect(req.session.formState?.caseSelect?.errors).toEqual([
      { text: 'Enter your unique reference number in the correct format', href: '#selectedUrn' },
    ])
    expect(res.redirect).toHaveBeenCalledWith(paths.CASES.SEARCH)
  })

  it('calls next(error) when an exception is thrown', async () => {
    const { req, res, next } = createReqRes({ selectedUrn: 'ABC123' })
    req.session = null as unknown as Request['session']

    await postEnterUniqueReferenceNumber(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error)
  })
})
