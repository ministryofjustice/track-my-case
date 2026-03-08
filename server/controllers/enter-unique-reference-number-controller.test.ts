import { isWithinUpcomingMaintenanceWindow, parseNowQueryParam } from './enter-unique-reference-number-controller'

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
    expect(parseNowQueryParam('2025-13-45')).toBeUndefined()
  })

  it('returns Date when value is valid ISO string', () => {
    const result = parseNowQueryParam('2025-02-14T12:00:00.000Z')
    expect(result).toBeInstanceOf(Date)
    expect(result?.toISOString()).toBe('2025-02-14T12:00:00.000Z')
  })

  it('returns Date when value is valid date string with spaces', () => {
    const result = parseNowQueryParam('  2025-02-15T10:30:00  ')
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2025)
    expect(result?.getMonth()).toBe(1)
    expect(result?.getDate()).toBe(15)
  })

  it('returns undefined when value is timestamp string', () => {
    const date = new Date('2025-02-14T14:00:00Z')
    const result = parseNowQueryParam(String(date.getTime()))
    expect(result?.getTime()).toBeUndefined()
  })
})

describe('isWithinUpcomingMaintenanceWindow', () => {
  it('returns false for Sunday', () => {
    // 2025-02-16 is Sunday
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-16T12:00:00'))).toBe(false)
  })

  it('returns false for Monday through Thursday', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-09T15:00:00'))).toBe(false) // Sun
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-10T15:00:00'))).toBe(false) // Mon
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-11T15:00:00'))).toBe(false) // Tue
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-12T15:00:00'))).toBe(false) // Wed
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-13T15:00:00'))).toBe(false) // Thu
  })

  it('returns false for Friday before 12:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-14T11:59:59'))).toBe(false)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-14T11:59'))).toBe(false)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-14T00:00:00'))).toBe(false)
  })

  it('returns true for Friday at 12:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-14T12:00:00'))).toBe(true)
  })

  it('returns true for Friday after 12:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-14T12:00:00'))).toBe(true)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-14T12:00'))).toBe(true)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-14T12:01:00'))).toBe(true)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-14T23:59:59'))).toBe(true)
  })

  it('returns true for Saturday before 18:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-15T00:00:00'))).toBe(true)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-15T17:59:59'))).toBe(true)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-15T17:59'))).toBe(true)
  })

  it('returns false for Saturday at 18:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-15T18:00:00'))).toBe(false)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-15T18:00'))).toBe(false)
  })

  it('returns false for Saturday after 18:00', () => {
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-15T18:01:00'))).toBe(false)
    expect(isWithinUpcomingMaintenanceWindow(new Date('2025-02-15T23:59:59'))).toBe(false)
  })
})
