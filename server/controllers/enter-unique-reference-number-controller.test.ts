import {
  isWithinOngoingMaintenanceWindow,
  isWithinUpcomingMaintenanceWindow,
  parseNowQueryParam,
} from './enter-unique-reference-number-controller'

const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

beforeEach(() => {
  consoleErrorSpy.mockClear()
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
