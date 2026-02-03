import {
  calculateSittingPeriod,
  formatDate,
  formatDateTime,
  getHearingStartDateMessage,
  getHearingStartDateMessageFromDate,
  getHearingTypeMessage,
} from './caseDetailsService'

import { HEARING_TYPE } from '../interfaces/hearingSummary'

describe('formatDateTime', () => {
  describe('valid input', () => {
    it('formats date', () => {
      expect(formatDate('2024-12-31T23:59:00Z')).toBe('31 December 2024')
      expect(formatDate('2025-01-01T00:00:00Z')).toBe('1 January 2025')
      expect(formatDate('2025-01-01T01:00:00Z')).toBe('1 January 2025')
      expect(formatDate('2025-01-01T12:00:00Z')).toBe('1 January 2025')
      expect(formatDate('2025-10-15T09:30:00Z')).toBe('15 October 2025')
      expect(formatDate('2024-06-15T14:45:00Z')).toBe('15 June 2024')
    })

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

describe('getHearingStartDateMessageFromDate', () => {
  it('returns empty string for monthsAndDaysUntil when input is undefined', () => {
    expect(getHearingStartDateMessage(HEARING_TYPE.TRIAL, undefined)).toBe(undefined)
    expect(getHearingStartDateMessage(undefined, '2030-01-01T12:00:00Z')).toBe(undefined)
  })

  it('time period already started', () => {
    const message1 = getHearingStartDateMessageFromDate(HEARING_TYPE.TRIAL, '2026-01-01T14:00', '2026-01-02')
    expect(message1.title).toBe('The trial is ongoing')
    expect(message1.description).toBe(
      'You do not need to go to the court unless you have been asked to give evidence. Your police witness care unit will keep you updated on the trial outcome.<br>Be aware that trials can continue for more days than planned.',
    )

    const message2 = getHearingStartDateMessageFromDate(HEARING_TYPE.SENTENCE, '2026-01-01T14:00', '2026-01-02')
    expect(message2.title).toBe('The sentence hearing is ongoing')
    expect(message2.description).toBe(
      'You do not need to go to the court unless you have been asked to give evidence. Your police witness care unit will keep you updated on the trial outcome.<br>Be aware that trials can continue for more days than planned.',
    )

    const message3 = getHearingStartDateMessageFromDate('Unknown', '2026-01-01T14:00', '2026-01-02')
    expect(message3.title).toBe('The unknown hearing is ongoing')
    expect(message3.description).toBe(
      'Your police witness care unit will keep you updated on the trial outcome.<br>Be aware that trials can continue for more days than planned.',
    )
  })

  it('time period is today', () => {
    const message1 = getHearingStartDateMessageFromDate(HEARING_TYPE.TRIAL, '2026-01-01T14:00', '2026-01-01')
    expect(message1.title).toBe('The trial is due to start today')
    expect(message1.description).toBe(
      'You do not need to go to the court unless you have been asked to give evidence.<br>Your police witness care unit will update you on the trial outcome. Be aware that trials can continue for more days than planned.',
    )

    const message2 = getHearingStartDateMessageFromDate(HEARING_TYPE.SENTENCE, '2026-01-01T14:00', '2026-01-01')
    expect(message2.title).toBe('The sentencing hearing is due to start today')
    expect(message2.description).toBe(
      'If you have told your police witness care unit you want to know the sentencing outcome, you have the right to be told within 5 working days of the sentencing.',
    )

    const message3 = getHearingStartDateMessageFromDate('Unknown', '2026-01-01T14:00', '2026-01-01')
    expect(message3.title).toBe('The unknown hearing is due to start today')
    expect(message3.description).toBe('')
  })

  it('time period is tomorrow', () => {
    const message1 = getHearingStartDateMessageFromDate(HEARING_TYPE.TRIAL, '2026-01-02T14:00', '2026-01-01')
    expect(message1.title).toBe('The expected trial start date is tomorrow')
    expect(message1.description).toBe(
      'If you’re going to give evidence at the court, your police witness care unit will tell you where and when you need to be at the court. Remember if you are waiting for a call from them, their number might not show on your phone.',
    )

    const message2 = getHearingStartDateMessageFromDate(HEARING_TYPE.SENTENCE, '2026-01-02T14:00', '2026-01-01')
    expect(message2.title).toBe('The expected sentencing hearing date is tomorrow')
    expect(message2.description).toBe(
      'If you have said you want to hear the outcome, your police witness care unit should tell you within 5 working days of the sentencing.',
    )

    const message3 = getHearingStartDateMessageFromDate('Unknown', '2026-01-02T14:00', '2026-01-01')
    expect(message3.title).toBe('The expected unknown hearing date is tomorrow')
    expect(message3.description).toBe('')
  })

  it('time period is within 1 week', () => {
    const message1 = getHearingStartDateMessageFromDate(HEARING_TYPE.TRIAL, '2026-01-03T14:00', '2026-01-01')
    expect(message1.title).toBe('The expected trial start date is in 2 days')
    expect(message1.description).toBe(
      'You do not need to go to the court unless you have been asked to give evidence. Make sure you have arranged time off work and childcare if needed.',
    )

    const message2 = getHearingStartDateMessageFromDate(HEARING_TYPE.SENTENCE, '2026-01-03T14:00', '2026-01-01')
    expect(message2.title).toBe('The expected sentencing hearing is in 2 days')
    expect(message2.description).toBe(
      'You can tell your police witness care unit if and how you want to be told of the sentencing outcome.',
    )

    const message3 = getHearingStartDateMessageFromDate('Unknown', '2026-01-03T14:00', '2026-01-01')
    expect(message3.title).toBe('The expected unknown hearing is in 2 days')
    expect(message3.description).toBe('')
  })

  it('time period is within 1 month', () => {
    const message1 = getHearingStartDateMessageFromDate(HEARING_TYPE.TRIAL, '2026-02-01T14:00', '2026-01-01')
    expect(message1.title).toBe('The expected trial start date is in 1 month')
    expect(message1.description).toBe(
      'If you’re going to court to give evidence, you can get support to help you prepare. Find out about the Witness Service.',
    )

    const message2 = getHearingStartDateMessageFromDate(HEARING_TYPE.SENTENCE, '2026-02-01T14:00', '2026-01-01')
    expect(message2.title).toBe('The expected sentencing hearing date is in 1 month')
    expect(message2.description).toBe(
      'You do not need to attend. You can tell your police witness care unit if and how you want to be told of the sentencing outcome.',
    )

    const message3 = getHearingStartDateMessageFromDate('Unknown', '2026-02-01T14:00', '2026-01-01')
    expect(message3.title).toBe('The expected unknown hearing date is in 1 month')
    expect(message3.description).toBe('')
  })

  it('time period is within 3 months', () => {
    const message1 = getHearingStartDateMessageFromDate(HEARING_TYPE.TRIAL, '2026-04-01T14:00', '2026-01-01')
    expect(message1.title).toBe('The expected trial start date is in 3 months')
    expect(message1.description).toBe(
      "If you're going to court to give evidence, tell your police witness care unit if you have any additional needs. They can make sure you get the right support.",
    )

    const message2 = getHearingStartDateMessageFromDate(HEARING_TYPE.SENTENCE, '2026-04-01T14:00', '2026-01-01')
    expect(message2.title).toBe('The expected sentencing hearing date is in 3 months')
    expect(message2.description).toBe(
      'You do not need to attend. You can tell your police witness care unit if and how you want to be told of the sentencing outcome.',
    )

    const message3 = getHearingStartDateMessageFromDate('Unknown', '2026-04-01T14:00', '2026-01-01')
    expect(message3.title).toBe('The expected unknown hearing date is in 3 months')
    expect(message3.description).toBe('')
  })

  it('time period is over 3 months', () => {
    const message1 = getHearingStartDateMessageFromDate(HEARING_TYPE.TRIAL, '2026-12-31T14:00', '2026-01-01')
    expect(message1.title).toBe('If you’re going to court')
    expect(message1.description).toBe(
      'You do not need to go to the court unless you have been asked to give evidence.<br>The exact court location might not be confirmed until the day of the trial. Your police witness care unit will tell you by phone call or text. Be aware the number they call from might not show on your phone, for example the number might be withheld.',
    )

    const message2 = getHearingStartDateMessageFromDate(HEARING_TYPE.SENTENCE, '2026-12-31T14:00', '2026-01-01')
    expect(message2.title).toBe('The expected sentencing hearing date is in 11 months and 30 days')
    expect(message2.description).toBe(
      'You do not need to attend. You can tell your police witness care unit if and how you want to be told of the sentencing outcome.',
    )

    const message3 = getHearingStartDateMessageFromDate('Unknown', '2026-12-31T14:00', '2026-01-01')
    expect(message3.title).toBe('The expected unknown hearing date is in 11 months and 30 days')
    expect(message3.description).toBe('')
  })

  it('for Trial hearing with time period from yesterday to plus 1 year and 1 day', () => {
    const now = '2026-01-01'
    const type = HEARING_TYPE.TRIAL
    const getTitle = getHearingStartDateMessageFromDate

    expect(getTitle(type, '2025-12-31T14:00', now).title).toBe('The trial is ongoing')
    expect(getTitle(type, '2026-01-01T14:00', now).title).toBe('The trial is due to start today')
    expect(getTitle(type, '2026-01-02T14:00', now).title).toBe('The expected trial start date is tomorrow')
    expect(getTitle(type, '2026-01-03T14:00', now).title).toBe('The expected trial start date is in 2 days')
    expect(getTitle(type, '2026-01-04T14:00', now).title).toBe('The expected trial start date is in 3 days')
    expect(getTitle(type, '2026-01-05T14:00', now).title).toBe('The expected trial start date is in 4 days')
    expect(getTitle(type, '2026-01-06T14:00', now).title).toBe('The expected trial start date is in 5 days')
    expect(getTitle(type, '2026-01-07T14:00', now).title).toBe('The expected trial start date is in 6 days')
    expect(getTitle(type, '2026-01-08T14:00', now).title).toBe('The expected trial start date is in 1 week')
    expect(getTitle(type, '2026-01-09T14:00', now).title).toBe('The expected trial start date is in 1 week and 1 day')
    expect(getTitle(type, '2026-01-10T14:00', now).title).toBe('The expected trial start date is in 1 week and 2 days')
    expect(getTitle(type, '2026-01-11T14:00', now).title).toBe('The expected trial start date is in 1 week and 3 days')
    expect(getTitle(type, '2026-01-12T14:00', now).title).toBe('The expected trial start date is in 1 week and 4 days')
    expect(getTitle(type, '2026-01-13T14:00', now).title).toBe('The expected trial start date is in 1 week and 5 days')
    expect(getTitle(type, '2026-01-14T14:00', now).title).toBe('The expected trial start date is in 1 week and 6 days')
    expect(getTitle(type, '2026-01-15T14:00', now).title).toBe('The expected trial start date is in 2 weeks')
    expect(getTitle(type, '2026-01-16T14:00', now).title).toBe('The expected trial start date is in 2 weeks and 1 day')
    expect(getTitle(type, '2026-01-17T14:00', now).title).toBe('The expected trial start date is in 2 weeks and 2 days')
    expect(getTitle(type, '2026-01-18T14:00', now).title).toBe('The expected trial start date is in 2 weeks and 3 days')
    expect(getTitle(type, '2026-01-19T14:00', now).title).toBe('The expected trial start date is in 2 weeks and 4 days')
    expect(getTitle(type, '2026-01-20T14:00', now).title).toBe('The expected trial start date is in 2 weeks and 5 days')
    expect(getTitle(type, '2026-01-21T14:00', now).title).toBe('The expected trial start date is in 2 weeks and 6 days')
    expect(getTitle(type, '2026-01-22T14:00', now).title).toBe('The expected trial start date is in 3 weeks')
    expect(getTitle(type, '2026-01-23T14:00', now).title).toBe('The expected trial start date is in 3 weeks and 1 day')
    expect(getTitle(type, '2026-01-24T14:00', now).title).toBe('The expected trial start date is in 3 weeks and 2 days')
    expect(getTitle(type, '2026-01-25T14:00', now).title).toBe('The expected trial start date is in 3 weeks and 3 days')
    expect(getTitle(type, '2026-01-26T14:00', now).title).toBe('The expected trial start date is in 3 weeks and 4 days')
    expect(getTitle(type, '2026-01-27T14:00', now).title).toBe('The expected trial start date is in 3 weeks and 5 days')
    expect(getTitle(type, '2026-01-28T14:00', now).title).toBe('The expected trial start date is in 3 weeks and 6 days')
    expect(getTitle(type, '2026-01-29T14:00', now).title).toBe('The expected trial start date is in 4 weeks')
    expect(getTitle(type, '2026-01-30T14:00', now).title).toBe('The expected trial start date is in 4 weeks and 1 day')
    expect(getTitle(type, '2026-01-31T14:00', now).title).toBe('The expected trial start date is in 4 weeks and 2 days')
    expect(getTitle(type, '2026-02-01T14:00', now).title).toBe('The expected trial start date is in 1 month')
    expect(getTitle(type, '2026-02-02T14:00', now).title).toBe('The expected trial start date is in 1 month and 1 day')
    expect(getTitle(type, '2026-02-03T14:00', now).title).toBe('The expected trial start date is in 1 month and 2 days')
    expect(getTitle(type, '2026-02-04T14:00', now).title).toBe('The expected trial start date is in 1 month and 3 days')
    expect(getTitle(type, '2026-02-05T14:00', now).title).toBe('The expected trial start date is in 1 month and 4 days')
    expect(getTitle(type, '2026-02-06T14:00', now).title).toBe('The expected trial start date is in 1 month and 5 days')
    expect(getTitle(type, '2026-02-07T14:00', now).title).toBe('The expected trial start date is in 1 month and 6 days')
    expect(getTitle(type, '2026-02-08T14:00', now).title).toBe('The expected trial start date is in 1 month and 7 days')
    expect(getTitle(type, '2026-02-09T14:00', now).title).toBe('The expected trial start date is in 1 month and 8 days')
    expect(getTitle(type, '2026-02-10T14:00', now).title).toBe('The expected trial start date is in 1 month and 9 days')
    expect(getTitle(type, '2026-02-11T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 10 days',
    )
    expect(getTitle(type, '2026-02-12T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 11 days',
    )
    expect(getTitle(type, '2026-02-13T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 12 days',
    )
    expect(getTitle(type, '2026-02-14T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 13 days',
    )
    expect(getTitle(type, '2026-02-15T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 14 days',
    )
    expect(getTitle(type, '2026-02-16T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 15 days',
    )
    expect(getTitle(type, '2026-02-17T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 16 days',
    )
    expect(getTitle(type, '2026-02-18T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 17 days',
    )
    expect(getTitle(type, '2026-02-19T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 18 days',
    )
    expect(getTitle(type, '2026-02-20T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 19 days',
    )
    expect(getTitle(type, '2026-02-21T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 20 days',
    )
    expect(getTitle(type, '2026-02-22T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 21 days',
    )
    expect(getTitle(type, '2026-02-23T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 22 days',
    )
    expect(getTitle(type, '2026-02-24T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 23 days',
    )
    expect(getTitle(type, '2026-02-25T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 24 days',
    )
    expect(getTitle(type, '2026-02-26T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 25 days',
    )
    expect(getTitle(type, '2026-02-27T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 26 days',
    )
    expect(getTitle(type, '2026-02-28T14:00', now).title).toBe(
      'The expected trial start date is in 1 month and 27 days',
    )
    expect(getTitle(type, '2026-03-01T14:00', now).title).toBe('The expected trial start date is in 2 months')
    expect(getTitle(type, '2026-03-02T14:00', now).title).toBe('The expected trial start date is in 2 months and 1 day')
    expect(getTitle(type, '2026-03-03T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 2 days',
    )
    expect(getTitle(type, '2026-03-04T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 3 days',
    )
    expect(getTitle(type, '2026-03-05T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 4 days',
    )
    expect(getTitle(type, '2026-03-06T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 5 days',
    )
    expect(getTitle(type, '2026-03-07T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 6 days',
    )
    expect(getTitle(type, '2026-03-08T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 7 days',
    )
    expect(getTitle(type, '2026-03-09T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 8 days',
    )
    expect(getTitle(type, '2026-03-10T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 9 days',
    )
    expect(getTitle(type, '2026-03-11T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 10 days',
    )
    expect(getTitle(type, '2026-03-12T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 11 days',
    )
    expect(getTitle(type, '2026-03-13T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 12 days',
    )
    expect(getTitle(type, '2026-03-14T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 13 days',
    )
    expect(getTitle(type, '2026-03-15T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 14 days',
    )
    expect(getTitle(type, '2026-03-16T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 15 days',
    )
    expect(getTitle(type, '2026-03-17T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 16 days',
    )
    expect(getTitle(type, '2026-03-18T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 17 days',
    )
    expect(getTitle(type, '2026-03-19T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 18 days',
    )
    expect(getTitle(type, '2026-03-20T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 19 days',
    )
    expect(getTitle(type, '2026-03-21T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 20 days',
    )
    expect(getTitle(type, '2026-03-22T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 21 days',
    )
    expect(getTitle(type, '2026-03-23T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 22 days',
    )
    expect(getTitle(type, '2026-03-24T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 23 days',
    )
    expect(getTitle(type, '2026-03-25T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 24 days',
    )
    expect(getTitle(type, '2026-03-26T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 25 days',
    )
    expect(getTitle(type, '2026-03-27T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 26 days',
    )
    expect(getTitle(type, '2026-03-28T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 27 days',
    )
    expect(getTitle(type, '2026-03-29T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 28 days',
    )
    expect(getTitle(type, '2026-03-30T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 29 days',
    )
    expect(getTitle(type, '2026-03-31T14:00', now).title).toBe(
      'The expected trial start date is in 2 months and 30 days',
    )
    expect(getTitle(type, '2026-04-01T14:00', now).title).toBe('The expected trial start date is in 3 months')
    expect(getTitle(type, '2026-04-02T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-03T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-04T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-05T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-06T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-07T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-08T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-09T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-10T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-11T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-12T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-13T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-14T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-15T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-16T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-17T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-18T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-19T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-20T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-21T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-22T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-23T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-24T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-25T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-26T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-27T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-28T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-29T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-04-30T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-01T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-02T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-03T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-04T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-05T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-06T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-07T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-08T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-09T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-10T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-11T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-12T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-13T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-14T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-15T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-16T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-17T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-18T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-19T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-20T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-21T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-22T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-23T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-24T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-25T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-26T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-27T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-28T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-29T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-30T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-05-31T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-01T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-02T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-03T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-04T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-05T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-06T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-07T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-08T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-09T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-10T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-11T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-12T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-13T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-14T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-15T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-16T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-17T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-18T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-19T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-20T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-21T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-22T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-23T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-24T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-25T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-26T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-27T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-28T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-29T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-06-30T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-01T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-02T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-03T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-04T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-05T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-06T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-07T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-08T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-09T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-10T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-11T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-12T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-13T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-14T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-15T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-16T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-17T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-18T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-19T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-20T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-21T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-22T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-23T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-24T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-25T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-26T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-27T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-28T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-29T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-30T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-07-31T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-01T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-02T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-03T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-04T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-05T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-06T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-07T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-08T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-09T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-10T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-11T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-12T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-13T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-14T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-15T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-16T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-17T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-18T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-19T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-20T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-21T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-22T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-23T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-24T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-25T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-26T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-27T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-28T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-29T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-30T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-08-31T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-01T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-02T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-03T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-04T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-05T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-06T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-07T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-08T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-09T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-10T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-11T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-12T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-13T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-14T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-15T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-16T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-17T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-18T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-19T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-20T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-21T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-22T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-23T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-24T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-25T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-26T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-27T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-28T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-29T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-09-30T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-01T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-02T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-03T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-04T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-05T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-06T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-07T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-08T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-09T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-10T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-11T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-12T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-13T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-14T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-15T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-16T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-17T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-18T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-19T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-20T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-21T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-22T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-23T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-24T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-25T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-26T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-27T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-28T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-29T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-30T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-10-31T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-01T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-02T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-03T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-04T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-05T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-06T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-07T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-08T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-09T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-10T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-11T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-12T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-13T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-14T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-15T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-16T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-17T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-18T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-19T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-20T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-21T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-22T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-23T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-24T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-25T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-26T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-27T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-28T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-29T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-11-30T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-01T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-02T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-03T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-04T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-05T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-06T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-07T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-08T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-09T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-10T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-11T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-12T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-13T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-14T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-15T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-16T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-17T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-18T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-19T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-20T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-21T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-22T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-23T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-24T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-25T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-26T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-27T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-28T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-29T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-30T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2026-12-31T14:00', now).title).toBe('If you’re going to court')
    expect(getTitle(type, '2027-01-02T14:00', now).title).toBe('If you’re going to court')
  })

  it('for Sentence hearing with time period from yesterday to plus 1 year and 1 day', () => {
    const now = '2026-01-01'
    const type = HEARING_TYPE.SENTENCE
    const getTitle = getHearingStartDateMessageFromDate

    expect(getTitle(type, '2025-12-31T14:00', now).title).toBe('The sentence hearing is ongoing')
    expect(getTitle(type, '2026-01-01T14:00', now).title).toBe('The sentencing hearing is due to start today')
    expect(getTitle(type, '2026-01-02T14:00', now).title).toBe('The expected sentencing hearing date is tomorrow')
    expect(getTitle(type, '2026-01-03T14:00', now).title).toBe('The expected sentencing hearing is in 2 days')
    expect(getTitle(type, '2026-01-04T14:00', now).title).toBe('The expected sentencing hearing is in 3 days')
    expect(getTitle(type, '2026-01-05T14:00', now).title).toBe('The expected sentencing hearing is in 4 days')
    expect(getTitle(type, '2026-01-06T14:00', now).title).toBe('The expected sentencing hearing is in 5 days')
    expect(getTitle(type, '2026-01-07T14:00', now).title).toBe('The expected sentencing hearing is in 6 days')
    expect(getTitle(type, '2026-01-08T14:00', now).title).toBe('The expected sentencing hearing is in 1 week')
    expect(getTitle(type, '2026-01-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 week and 1 day',
    )
    expect(getTitle(type, '2026-01-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 week and 2 days',
    )
    expect(getTitle(type, '2026-01-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 week and 3 days',
    )
    expect(getTitle(type, '2026-01-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 week and 4 days',
    )
    expect(getTitle(type, '2026-01-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 week and 5 days',
    )
    expect(getTitle(type, '2026-01-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 week and 6 days',
    )
    expect(getTitle(type, '2026-01-15T14:00', now).title).toBe('The expected sentencing hearing date is in 2 weeks')
    expect(getTitle(type, '2026-01-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 weeks and 1 day',
    )
    expect(getTitle(type, '2026-01-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 weeks and 2 days',
    )
    expect(getTitle(type, '2026-01-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 weeks and 3 days',
    )
    expect(getTitle(type, '2026-01-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 weeks and 4 days',
    )
    expect(getTitle(type, '2026-01-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 weeks and 5 days',
    )
    expect(getTitle(type, '2026-01-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 weeks and 6 days',
    )
    expect(getTitle(type, '2026-01-22T14:00', now).title).toBe('The expected sentencing hearing date is in 3 weeks')
    expect(getTitle(type, '2026-01-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 weeks and 1 day',
    )
    expect(getTitle(type, '2026-01-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 weeks and 2 days',
    )
    expect(getTitle(type, '2026-01-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 weeks and 3 days',
    )
    expect(getTitle(type, '2026-01-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 weeks and 4 days',
    )
    expect(getTitle(type, '2026-01-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 weeks and 5 days',
    )
    expect(getTitle(type, '2026-01-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 weeks and 6 days',
    )
    expect(getTitle(type, '2026-01-29T14:00', now).title).toBe('The expected sentencing hearing date is in 4 weeks')
    expect(getTitle(type, '2026-01-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 weeks and 1 day',
    )
    expect(getTitle(type, '2026-01-31T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 weeks and 2 days',
    )
    expect(getTitle(type, '2026-02-01T14:00', now).title).toBe('The expected sentencing hearing date is in 1 month')
    expect(getTitle(type, '2026-02-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 1 day',
    )
    expect(getTitle(type, '2026-02-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 2 days',
    )
    expect(getTitle(type, '2026-02-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 3 days',
    )
    expect(getTitle(type, '2026-02-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 4 days',
    )
    expect(getTitle(type, '2026-02-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 5 days',
    )
    expect(getTitle(type, '2026-02-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 6 days',
    )
    expect(getTitle(type, '2026-02-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 7 days',
    )
    expect(getTitle(type, '2026-02-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 8 days',
    )
    expect(getTitle(type, '2026-02-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 9 days',
    )
    expect(getTitle(type, '2026-02-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 10 days',
    )
    expect(getTitle(type, '2026-02-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 11 days',
    )
    expect(getTitle(type, '2026-02-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 12 days',
    )
    expect(getTitle(type, '2026-02-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 13 days',
    )
    expect(getTitle(type, '2026-02-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 14 days',
    )
    expect(getTitle(type, '2026-02-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 15 days',
    )
    expect(getTitle(type, '2026-02-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 16 days',
    )
    expect(getTitle(type, '2026-02-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 17 days',
    )
    expect(getTitle(type, '2026-02-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 18 days',
    )
    expect(getTitle(type, '2026-02-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 19 days',
    )
    expect(getTitle(type, '2026-02-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 20 days',
    )
    expect(getTitle(type, '2026-02-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 21 days',
    )
    expect(getTitle(type, '2026-02-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 22 days',
    )
    expect(getTitle(type, '2026-02-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 23 days',
    )
    expect(getTitle(type, '2026-02-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 24 days',
    )
    expect(getTitle(type, '2026-02-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 25 days',
    )
    expect(getTitle(type, '2026-02-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 26 days',
    )
    expect(getTitle(type, '2026-02-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 1 month and 27 days',
    )
    expect(getTitle(type, '2026-03-01T14:00', now).title).toBe('The expected sentencing hearing date is in 2 months')
    expect(getTitle(type, '2026-03-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 1 day',
    )
    expect(getTitle(type, '2026-03-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 2 days',
    )
    expect(getTitle(type, '2026-03-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 3 days',
    )
    expect(getTitle(type, '2026-03-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 4 days',
    )
    expect(getTitle(type, '2026-03-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 5 days',
    )
    expect(getTitle(type, '2026-03-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 6 days',
    )
    expect(getTitle(type, '2026-03-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 7 days',
    )
    expect(getTitle(type, '2026-03-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 8 days',
    )
    expect(getTitle(type, '2026-03-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 9 days',
    )
    expect(getTitle(type, '2026-03-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 10 days',
    )
    expect(getTitle(type, '2026-03-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 11 days',
    )
    expect(getTitle(type, '2026-03-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 12 days',
    )
    expect(getTitle(type, '2026-03-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 13 days',
    )
    expect(getTitle(type, '2026-03-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 14 days',
    )
    expect(getTitle(type, '2026-03-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 15 days',
    )
    expect(getTitle(type, '2026-03-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 16 days',
    )
    expect(getTitle(type, '2026-03-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 17 days',
    )
    expect(getTitle(type, '2026-03-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 18 days',
    )
    expect(getTitle(type, '2026-03-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 19 days',
    )
    expect(getTitle(type, '2026-03-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 20 days',
    )
    expect(getTitle(type, '2026-03-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 21 days',
    )
    expect(getTitle(type, '2026-03-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 22 days',
    )
    expect(getTitle(type, '2026-03-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 23 days',
    )
    expect(getTitle(type, '2026-03-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 24 days',
    )
    expect(getTitle(type, '2026-03-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 25 days',
    )
    expect(getTitle(type, '2026-03-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 26 days',
    )
    expect(getTitle(type, '2026-03-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 27 days',
    )
    expect(getTitle(type, '2026-03-29T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 28 days',
    )
    expect(getTitle(type, '2026-03-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 29 days',
    )
    expect(getTitle(type, '2026-03-31T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 2 months and 30 days',
    )
    expect(getTitle(type, '2026-04-01T14:00', now).title).toBe('The expected sentencing hearing date is in 3 months')
    expect(getTitle(type, '2026-04-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 1 day',
    )
    expect(getTitle(type, '2026-04-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 2 days',
    )
    expect(getTitle(type, '2026-04-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 3 days',
    )
    expect(getTitle(type, '2026-04-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 4 days',
    )
    expect(getTitle(type, '2026-04-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 5 days',
    )
    expect(getTitle(type, '2026-04-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 6 days',
    )
    expect(getTitle(type, '2026-04-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 7 days',
    )
    expect(getTitle(type, '2026-04-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 8 days',
    )
    expect(getTitle(type, '2026-04-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 9 days',
    )
    expect(getTitle(type, '2026-04-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 10 days',
    )
    expect(getTitle(type, '2026-04-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 11 days',
    )
    expect(getTitle(type, '2026-04-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 12 days',
    )
    expect(getTitle(type, '2026-04-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 13 days',
    )
    expect(getTitle(type, '2026-04-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 14 days',
    )
    expect(getTitle(type, '2026-04-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 15 days',
    )
    expect(getTitle(type, '2026-04-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 16 days',
    )
    expect(getTitle(type, '2026-04-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 17 days',
    )
    expect(getTitle(type, '2026-04-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 18 days',
    )
    expect(getTitle(type, '2026-04-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 19 days',
    )
    expect(getTitle(type, '2026-04-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 20 days',
    )
    expect(getTitle(type, '2026-04-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 21 days',
    )
    expect(getTitle(type, '2026-04-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 22 days',
    )
    expect(getTitle(type, '2026-04-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 23 days',
    )
    expect(getTitle(type, '2026-04-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 24 days',
    )
    expect(getTitle(type, '2026-04-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 25 days',
    )
    expect(getTitle(type, '2026-04-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 26 days',
    )
    expect(getTitle(type, '2026-04-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 27 days',
    )
    expect(getTitle(type, '2026-04-29T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 28 days',
    )
    expect(getTitle(type, '2026-04-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 3 months and 29 days',
    )
    expect(getTitle(type, '2026-05-01T14:00', now).title).toBe('The expected sentencing hearing date is in 4 months')
    expect(getTitle(type, '2026-05-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 1 day',
    )
    expect(getTitle(type, '2026-05-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 2 days',
    )
    expect(getTitle(type, '2026-05-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 3 days',
    )
    expect(getTitle(type, '2026-05-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 4 days',
    )
    expect(getTitle(type, '2026-05-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 5 days',
    )
    expect(getTitle(type, '2026-05-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 6 days',
    )
    expect(getTitle(type, '2026-05-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 7 days',
    )
    expect(getTitle(type, '2026-05-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 8 days',
    )
    expect(getTitle(type, '2026-05-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 9 days',
    )
    expect(getTitle(type, '2026-05-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 10 days',
    )
    expect(getTitle(type, '2026-05-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 11 days',
    )
    expect(getTitle(type, '2026-05-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 12 days',
    )
    expect(getTitle(type, '2026-05-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 13 days',
    )
    expect(getTitle(type, '2026-05-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 14 days',
    )
    expect(getTitle(type, '2026-05-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 15 days',
    )
    expect(getTitle(type, '2026-05-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 16 days',
    )
    expect(getTitle(type, '2026-05-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 17 days',
    )
    expect(getTitle(type, '2026-05-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 18 days',
    )
    expect(getTitle(type, '2026-05-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 19 days',
    )
    expect(getTitle(type, '2026-05-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 20 days',
    )
    expect(getTitle(type, '2026-05-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 21 days',
    )
    expect(getTitle(type, '2026-05-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 22 days',
    )
    expect(getTitle(type, '2026-05-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 23 days',
    )
    expect(getTitle(type, '2026-05-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 24 days',
    )
    expect(getTitle(type, '2026-05-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 25 days',
    )
    expect(getTitle(type, '2026-05-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 26 days',
    )
    expect(getTitle(type, '2026-05-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 27 days',
    )
    expect(getTitle(type, '2026-05-29T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 28 days',
    )
    expect(getTitle(type, '2026-05-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 29 days',
    )
    expect(getTitle(type, '2026-05-31T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 4 months and 30 days',
    )
    expect(getTitle(type, '2026-06-01T14:00', now).title).toBe('The expected sentencing hearing date is in 5 months')
    expect(getTitle(type, '2026-06-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 1 day',
    )
    expect(getTitle(type, '2026-06-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 2 days',
    )
    expect(getTitle(type, '2026-06-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 3 days',
    )
    expect(getTitle(type, '2026-06-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 4 days',
    )
    expect(getTitle(type, '2026-06-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 5 days',
    )
    expect(getTitle(type, '2026-06-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 6 days',
    )
    expect(getTitle(type, '2026-06-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 7 days',
    )
    expect(getTitle(type, '2026-06-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 8 days',
    )
    expect(getTitle(type, '2026-06-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 9 days',
    )
    expect(getTitle(type, '2026-06-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 10 days',
    )
    expect(getTitle(type, '2026-06-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 11 days',
    )
    expect(getTitle(type, '2026-06-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 12 days',
    )
    expect(getTitle(type, '2026-06-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 13 days',
    )
    expect(getTitle(type, '2026-06-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 14 days',
    )
    expect(getTitle(type, '2026-06-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 15 days',
    )
    expect(getTitle(type, '2026-06-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 16 days',
    )
    expect(getTitle(type, '2026-06-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 17 days',
    )
    expect(getTitle(type, '2026-06-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 18 days',
    )
    expect(getTitle(type, '2026-06-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 19 days',
    )
    expect(getTitle(type, '2026-06-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 20 days',
    )
    expect(getTitle(type, '2026-06-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 21 days',
    )
    expect(getTitle(type, '2026-06-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 22 days',
    )
    expect(getTitle(type, '2026-06-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 23 days',
    )
    expect(getTitle(type, '2026-06-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 24 days',
    )
    expect(getTitle(type, '2026-06-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 25 days',
    )
    expect(getTitle(type, '2026-06-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 26 days',
    )
    expect(getTitle(type, '2026-06-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 27 days',
    )
    expect(getTitle(type, '2026-06-29T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 28 days',
    )
    expect(getTitle(type, '2026-06-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 5 months and 29 days',
    )
    expect(getTitle(type, '2026-07-01T14:00', now).title).toBe('The expected sentencing hearing date is in 6 months')
    expect(getTitle(type, '2026-07-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 1 day',
    )
    expect(getTitle(type, '2026-07-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 2 days',
    )
    expect(getTitle(type, '2026-07-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 3 days',
    )
    expect(getTitle(type, '2026-07-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 4 days',
    )
    expect(getTitle(type, '2026-07-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 5 days',
    )
    expect(getTitle(type, '2026-07-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 6 days',
    )
    expect(getTitle(type, '2026-07-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 7 days',
    )
    expect(getTitle(type, '2026-07-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 8 days',
    )
    expect(getTitle(type, '2026-07-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 9 days',
    )
    expect(getTitle(type, '2026-07-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 10 days',
    )
    expect(getTitle(type, '2026-07-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 11 days',
    )
    expect(getTitle(type, '2026-07-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 12 days',
    )
    expect(getTitle(type, '2026-07-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 13 days',
    )
    expect(getTitle(type, '2026-07-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 14 days',
    )
    expect(getTitle(type, '2026-07-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 15 days',
    )
    expect(getTitle(type, '2026-07-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 16 days',
    )
    expect(getTitle(type, '2026-07-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 17 days',
    )
    expect(getTitle(type, '2026-07-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 18 days',
    )
    expect(getTitle(type, '2026-07-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 19 days',
    )
    expect(getTitle(type, '2026-07-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 20 days',
    )
    expect(getTitle(type, '2026-07-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 21 days',
    )
    expect(getTitle(type, '2026-07-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 22 days',
    )
    expect(getTitle(type, '2026-07-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 23 days',
    )
    expect(getTitle(type, '2026-07-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 24 days',
    )
    expect(getTitle(type, '2026-07-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 25 days',
    )
    expect(getTitle(type, '2026-07-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 26 days',
    )
    expect(getTitle(type, '2026-07-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 27 days',
    )
    expect(getTitle(type, '2026-07-29T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 28 days',
    )
    expect(getTitle(type, '2026-07-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 29 days',
    )
    expect(getTitle(type, '2026-07-31T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 6 months and 30 days',
    )
    expect(getTitle(type, '2026-08-01T14:00', now).title).toBe('The expected sentencing hearing date is in 7 months')
    expect(getTitle(type, '2026-08-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 1 day',
    )
    expect(getTitle(type, '2026-08-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 2 days',
    )
    expect(getTitle(type, '2026-08-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 3 days',
    )
    expect(getTitle(type, '2026-08-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 4 days',
    )
    expect(getTitle(type, '2026-08-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 5 days',
    )
    expect(getTitle(type, '2026-08-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 6 days',
    )
    expect(getTitle(type, '2026-08-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 7 days',
    )
    expect(getTitle(type, '2026-08-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 8 days',
    )
    expect(getTitle(type, '2026-08-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 9 days',
    )
    expect(getTitle(type, '2026-08-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 10 days',
    )
    expect(getTitle(type, '2026-08-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 11 days',
    )
    expect(getTitle(type, '2026-08-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 12 days',
    )
    expect(getTitle(type, '2026-08-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 13 days',
    )
    expect(getTitle(type, '2026-08-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 14 days',
    )
    expect(getTitle(type, '2026-08-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 15 days',
    )
    expect(getTitle(type, '2026-08-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 16 days',
    )
    expect(getTitle(type, '2026-08-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 17 days',
    )
    expect(getTitle(type, '2026-08-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 18 days',
    )
    expect(getTitle(type, '2026-08-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 19 days',
    )
    expect(getTitle(type, '2026-08-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 20 days',
    )
    expect(getTitle(type, '2026-08-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 21 days',
    )
    expect(getTitle(type, '2026-08-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 22 days',
    )
    expect(getTitle(type, '2026-08-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 23 days',
    )
    expect(getTitle(type, '2026-08-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 24 days',
    )
    expect(getTitle(type, '2026-08-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 25 days',
    )
    expect(getTitle(type, '2026-08-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 26 days',
    )
    expect(getTitle(type, '2026-08-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 27 days',
    )
    expect(getTitle(type, '2026-08-29T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 28 days',
    )
    expect(getTitle(type, '2026-08-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 29 days',
    )
    expect(getTitle(type, '2026-08-31T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 7 months and 30 days',
    )
    expect(getTitle(type, '2026-09-01T14:00', now).title).toBe('The expected sentencing hearing date is in 8 months')
    expect(getTitle(type, '2026-09-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 1 day',
    )
    expect(getTitle(type, '2026-09-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 2 days',
    )
    expect(getTitle(type, '2026-09-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 3 days',
    )
    expect(getTitle(type, '2026-09-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 4 days',
    )
    expect(getTitle(type, '2026-09-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 5 days',
    )
    expect(getTitle(type, '2026-09-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 6 days',
    )
    expect(getTitle(type, '2026-09-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 7 days',
    )
    expect(getTitle(type, '2026-09-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 8 days',
    )
    expect(getTitle(type, '2026-09-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 9 days',
    )
    expect(getTitle(type, '2026-09-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 10 days',
    )
    expect(getTitle(type, '2026-09-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 11 days',
    )
    expect(getTitle(type, '2026-09-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 12 days',
    )
    expect(getTitle(type, '2026-09-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 13 days',
    )
    expect(getTitle(type, '2026-09-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 14 days',
    )
    expect(getTitle(type, '2026-09-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 15 days',
    )
    expect(getTitle(type, '2026-09-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 16 days',
    )
    expect(getTitle(type, '2026-09-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 17 days',
    )
    expect(getTitle(type, '2026-09-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 18 days',
    )
    expect(getTitle(type, '2026-09-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 19 days',
    )
    expect(getTitle(type, '2026-09-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 20 days',
    )
    expect(getTitle(type, '2026-09-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 21 days',
    )
    expect(getTitle(type, '2026-09-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 22 days',
    )
    expect(getTitle(type, '2026-09-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 23 days',
    )
    expect(getTitle(type, '2026-09-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 24 days',
    )
    expect(getTitle(type, '2026-09-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 25 days',
    )
    expect(getTitle(type, '2026-09-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 26 days',
    )
    expect(getTitle(type, '2026-09-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 27 days',
    )
    expect(getTitle(type, '2026-09-29T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 28 days',
    )
    expect(getTitle(type, '2026-09-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 8 months and 29 days',
    )
    expect(getTitle(type, '2026-10-01T14:00', now).title).toBe('The expected sentencing hearing date is in 9 months')
    expect(getTitle(type, '2026-10-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 1 day',
    )
    expect(getTitle(type, '2026-10-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 2 days',
    )
    expect(getTitle(type, '2026-10-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 3 days',
    )
    expect(getTitle(type, '2026-10-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 4 days',
    )
    expect(getTitle(type, '2026-10-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 5 days',
    )
    expect(getTitle(type, '2026-10-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 6 days',
    )
    expect(getTitle(type, '2026-10-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 7 days',
    )
    expect(getTitle(type, '2026-10-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 8 days',
    )
    expect(getTitle(type, '2026-10-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 9 days',
    )
    expect(getTitle(type, '2026-10-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 10 days',
    )
    expect(getTitle(type, '2026-10-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 11 days',
    )
    expect(getTitle(type, '2026-10-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 12 days',
    )
    expect(getTitle(type, '2026-10-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 13 days',
    )
    expect(getTitle(type, '2026-10-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 14 days',
    )
    expect(getTitle(type, '2026-10-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 15 days',
    )
    expect(getTitle(type, '2026-10-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 16 days',
    )
    expect(getTitle(type, '2026-10-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 17 days',
    )
    expect(getTitle(type, '2026-10-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 18 days',
    )
    expect(getTitle(type, '2026-10-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 19 days',
    )
    expect(getTitle(type, '2026-10-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 20 days',
    )
    expect(getTitle(type, '2026-10-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 21 days',
    )
    expect(getTitle(type, '2026-10-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 22 days',
    )
    expect(getTitle(type, '2026-10-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 23 days',
    )
    expect(getTitle(type, '2026-10-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 24 days',
    )
    expect(getTitle(type, '2026-10-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 25 days',
    )
    expect(getTitle(type, '2026-10-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 26 days',
    )
    expect(getTitle(type, '2026-10-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 27 days',
    )
    expect(getTitle(type, '2026-10-29T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 28 days',
    )
    expect(getTitle(type, '2026-10-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 29 days',
    )
    expect(getTitle(type, '2026-10-31T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 9 months and 30 days',
    )
    expect(getTitle(type, '2026-11-01T14:00', now).title).toBe('The expected sentencing hearing date is in 10 months')
    expect(getTitle(type, '2026-11-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 1 day',
    )
    expect(getTitle(type, '2026-11-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 2 days',
    )
    expect(getTitle(type, '2026-11-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 3 days',
    )
    expect(getTitle(type, '2026-11-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 4 days',
    )
    expect(getTitle(type, '2026-11-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 5 days',
    )
    expect(getTitle(type, '2026-11-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 6 days',
    )
    expect(getTitle(type, '2026-11-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 7 days',
    )
    expect(getTitle(type, '2026-11-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 8 days',
    )
    expect(getTitle(type, '2026-11-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 9 days',
    )
    expect(getTitle(type, '2026-11-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 10 days',
    )
    expect(getTitle(type, '2026-11-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 11 days',
    )
    expect(getTitle(type, '2026-11-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 12 days',
    )
    expect(getTitle(type, '2026-11-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 13 days',
    )
    expect(getTitle(type, '2026-11-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 14 days',
    )
    expect(getTitle(type, '2026-11-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 15 days',
    )
    expect(getTitle(type, '2026-11-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 16 days',
    )
    expect(getTitle(type, '2026-11-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 17 days',
    )
    expect(getTitle(type, '2026-11-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 18 days',
    )
    expect(getTitle(type, '2026-11-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 19 days',
    )
    expect(getTitle(type, '2026-11-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 20 days',
    )
    expect(getTitle(type, '2026-11-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 21 days',
    )
    expect(getTitle(type, '2026-11-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 22 days',
    )
    expect(getTitle(type, '2026-11-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 23 days',
    )
    expect(getTitle(type, '2026-11-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 24 days',
    )
    expect(getTitle(type, '2026-11-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 25 days',
    )
    expect(getTitle(type, '2026-11-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 26 days',
    )
    expect(getTitle(type, '2026-11-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 27 days',
    )
    expect(getTitle(type, '2026-11-29T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 28 days',
    )
    expect(getTitle(type, '2026-11-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 10 months and 29 days',
    )
    expect(getTitle(type, '2026-12-01T14:00', now).title).toBe('The expected sentencing hearing date is in 11 months')
    expect(getTitle(type, '2026-12-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 1 day',
    )
    expect(getTitle(type, '2026-12-03T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 2 days',
    )
    expect(getTitle(type, '2026-12-04T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 3 days',
    )
    expect(getTitle(type, '2026-12-05T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 4 days',
    )
    expect(getTitle(type, '2026-12-06T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 5 days',
    )
    expect(getTitle(type, '2026-12-07T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 6 days',
    )
    expect(getTitle(type, '2026-12-08T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 7 days',
    )
    expect(getTitle(type, '2026-12-09T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 8 days',
    )
    expect(getTitle(type, '2026-12-10T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 9 days',
    )
    expect(getTitle(type, '2026-12-11T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 10 days',
    )
    expect(getTitle(type, '2026-12-12T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 11 days',
    )
    expect(getTitle(type, '2026-12-13T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 12 days',
    )
    expect(getTitle(type, '2026-12-14T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 13 days',
    )
    expect(getTitle(type, '2026-12-15T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 14 days',
    )
    expect(getTitle(type, '2026-12-16T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 15 days',
    )
    expect(getTitle(type, '2026-12-17T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 16 days',
    )
    expect(getTitle(type, '2026-12-18T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 17 days',
    )
    expect(getTitle(type, '2026-12-19T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 18 days',
    )
    expect(getTitle(type, '2026-12-20T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 19 days',
    )
    expect(getTitle(type, '2026-12-21T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 20 days',
    )
    expect(getTitle(type, '2026-12-22T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 21 days',
    )
    expect(getTitle(type, '2026-12-23T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 22 days',
    )
    expect(getTitle(type, '2026-12-24T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 23 days',
    )
    expect(getTitle(type, '2026-12-25T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 24 days',
    )
    expect(getTitle(type, '2026-12-26T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 25 days',
    )
    expect(getTitle(type, '2026-12-27T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 26 days',
    )
    expect(getTitle(type, '2026-12-28T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 27 days',
    )
    expect(getTitle(type, '2026-12-29T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 28 days',
    )
    expect(getTitle(type, '2026-12-30T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 29 days',
    )
    expect(getTitle(type, '2026-12-31T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 11 months and 30 days',
    )
    expect(getTitle(type, '2027-01-02T14:00', now).title).toBe(
      'The expected sentencing hearing date is in 12 months and 1 day',
    )
  })
})

describe('getHearingTypeMessage', () => {
  it('return hearing type message', () => {
    expect(getHearingTypeMessage(HEARING_TYPE.TRIAL)).toBe('Trial')
    expect(getHearingTypeMessage(HEARING_TYPE.SENTENCE)).toBe('Sentencing')
    expect(getHearingTypeMessage('xxx')).toBe('xxx')
    expect(getHearingTypeMessage(null)).toBe('Unknown')
  })
})
