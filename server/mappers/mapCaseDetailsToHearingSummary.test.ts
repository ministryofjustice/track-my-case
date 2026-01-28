import { calculateSittingPeriod } from './mapCaseDetailsToHearingSummary'

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
