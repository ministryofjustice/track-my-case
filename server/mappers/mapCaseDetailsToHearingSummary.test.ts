import {
  calculateSittingPeriod,
  formatDateTime,
  monthsAndDaysBetween,
  monthsAndDaysUntil,
} from './mapCaseDetailsToHearingSummary'

describe('formatDateTime', () => {
  describe('valid input', () => {
    it('formats date time', () => {
      expect(formatDateTime('2024-12-31T23:59:00Z')).toBe('31 December 2024 at 11:59 pm')
      expect(formatDateTime('2025-01-01T00:00:00Z')).toBe('1 January 2025 at 12:00 am')
      expect(formatDateTime('2025-01-01T01:00:00Z')).toBe('1 January 2025 at 1:00 am')
      expect(formatDateTime('2025-01-01T12:00:00Z')).toBe('1 January 2025 at 12:00 pm')
      expect(formatDateTime('2025-10-15T09:30:00Z')).toBe('15 October 2025 at 9:30 am')
      expect(formatDateTime('2024-06-15T14:45:00Z')).toBe('15 June 2024 at 2:45 pm')
    })

    it('returns consistent format for same input', () => {
      const input = '2025-10-15T09:30:00Z'
      expect(formatDateTime(input)).toBe(formatDateTime(input))
    })
  })

  describe('empty or invalid input', () => {
    it('returns empty string when input is undefined', () => {
      expect(formatDateTime(undefined)).toBe('')
    })

    it('returns empty string when input is empty string', () => {
      expect(formatDateTime('')).toBe('')
    })
  })

  describe('date parsing', () => {
    it('accepts ISO 8601 date-time string', () => {
      expect(formatDateTime('2025-10-15T09:30:00.000Z')).toBe('15 October 2025 at 9:30 am')
    })

    it('accepts date-only string (interprets as UTC midnight)', () => {
      expect(formatDateTime('2025-10-15')).toBe('15 October 2025 at 12:00 am')
    })
  })
})

describe('calculateSittingPeriod', () => {
  describe('time-only periods (same day)', () => {
    it('calculates 2 hours correctly', () => {
      // 09:00 to 11:00 = 2 hours
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-15T11:00:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('1 day')
    })

    it('calculates 1 hour 30 minutes correctly', () => {
      // 09:00 to 10:30 = 1 hour 30 minutes
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-15T10:30:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('1 day')
    })

    it('calculates 45 minutes correctly', () => {
      // 09:00 to 09:45 = 45 minutes
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-15T09:45:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('1 day')
    })
  })

  describe('multi-day periods', () => {
    it('calculates 1 day correctly', () => {
      // Mon 09:00 to Tue 09:00 = 1 day
      const start = '2024-01-15T09:00:00Z' // Monday
      const end = '2024-01-16T09:00:00Z' // Tuesday
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('2 days')
    })

    it('calculates 1 day 4 hours correctly', () => {
      // Mon 09:00 to Tue 13:00 = 1 day 4 hours
      const start = '2024-01-15T09:00:00Z' // Monday 09:00
      const end = '2024-01-16T13:00:00Z' // Tuesday 13:00
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('2 days')
    })

    it('calculates 40 day 4 hours correctly', () => {
      // Mon 09:00 to Tue 13:00 = 1 day 4 hours
      const start = '2024-01-01T09:00:00Z' // Monday 09:00
      const end = '2024-03-16T13:00:00Z' // Tuesday 13:00
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('76 days')
    })
  })

  describe('edge cases', () => {
    it('returns empty string when start is missing', () => {
      const result = calculateSittingPeriod(undefined, '2024-01-15T11:00:00Z')
      expect(result).toBe('')
    })

    it('returns empty string when end is missing', () => {
      const result = calculateSittingPeriod('2024-01-15T09:00:00Z', undefined)
      expect(result).toBe('')
    })

    it('returns empty string when both are missing', () => {
      const result = calculateSittingPeriod(undefined, undefined)
      expect(result).toBe('')
    })

    it('returns empty string when end is before start', () => {
      const start = '2024-01-15T11:00:00Z'
      const end = '2024-01-15T09:00:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('1 day')
    })

    it('returns empty string when end equals start', () => {
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-15T09:00:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('1 day')
    })
  })

  describe('singular vs plural forms', () => {
    it('uses singular "hour" for 1 hour', () => {
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-15T10:00:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('1 day')
    })

    it('uses singular "minute" for 1 minute', () => {
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-15T09:01:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('1 day')
    })

    it('uses singular "day" for 1 day', () => {
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-16T09:00:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('2 days')
    })

    it('uses plural "days" for multiple days', () => {
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-17T09:00:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('3 days')
    })

    it('uses plural "hours" for multiple hours', () => {
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-15T12:00:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('1 day')
    })

    it('uses plural "minutes" for multiple minutes', () => {
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-15T09:05:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('1 day')
    })
  })

  describe('complex combinations', () => {
    it('handles days with hours and minutes', () => {
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-16T13:30:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('2 days')
    })

    it('handles hours with minutes', () => {
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-15T11:30:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('1 day')
    })

    it('handles multiple days with hours', () => {
      const start = '2024-01-15T09:00:00Z'
      const end = '2024-01-17T13:00:00Z'
      const result = calculateSittingPeriod(start, end)
      expect(result).toBe('3 days')
    })
  })
})

describe('monthsAndDaysBetween', () => {
  it('returns time period', () => {
    expect(monthsAndDaysBetween('2026-01-01', '2026-01-01T14:00')).toBe('is today')
    expect(monthsAndDaysBetween('2026-01-01', '2026-01-02T14:00')).toBe('is in 1 day')
    expect(monthsAndDaysBetween('2026-01-30', '2026-02-06T14:00')).toBe('is in 7 days')
    expect(monthsAndDaysBetween('2025-11-15', '2026-02-06T14:00')).toBe('is in 2 months and 22 days')
    expect(monthsAndDaysBetween('2026-01-06', '2026-02-05')).toBe('is in 30 days')
    expect(monthsAndDaysBetween('2026-01-06', '2026-02-06')).toBe('is in 1 month')
    expect(monthsAndDaysBetween('2026-01-06', '2026-02-07')).toBe('is in 1 month and 1 day')
    expect(monthsAndDaysBetween('2026-07-01', '2026-07-22')).toBe('is in 21 days')
    expect(monthsAndDaysBetween('2026-07-01', '2026-07-31')).toBe('is in 30 days')
    expect(monthsAndDaysBetween('2026-07-01', '2026-08-01')).toBe('is in 1 month')
    expect(monthsAndDaysBetween('2026-02-06', '2026-02-06T14:00')).toBe('is today')
    expect(monthsAndDaysBetween('2026-02-10', '2026-02-06')).toBe('is already passed')
    expect(monthsAndDaysBetween('2026-02-05', '2026-02-06')).toBe('is in 1 day')
    expect(monthsAndDaysBetween('2026-02-05', '2027-03-06')).toBe('is in 13 months and 1 day')
    expect(monthsAndDaysBetween('2026-02-05', '2036-02-06')).toBe('is in 120 months and 1 day')
  })

  it('returns empty string for monthsAndDaysUntil when input is undefined', () => {
    expect(monthsAndDaysUntil(undefined)).toBe('')
  })

  it('returns a string for monthsAndDaysUntil when given ISO date', () => {
    const result = monthsAndDaysUntil('2030-01-01T12:00:00Z')
    expect(result).toMatch(/\d+ month(s)? and \d+ day(s)?/)
  })
})
