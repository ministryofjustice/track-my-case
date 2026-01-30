import { HearingDetails } from '../interfaces/caseDetails'
import { HearingSummary } from '../interfaces/hearingSummary'

export const formatDateTime = (input?: string): string => {
  if (!input) return ''
  const date = new Date(input)
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  })
}

export const calculateSittingPeriod = (sittingStart?: string, sittingEnd?: string): string => {
  if (!sittingStart || !sittingEnd) {
    return ''
  }

  const start = new Date(sittingStart)
  const end = new Date(sittingEnd)

  // Normalise to start of day (UTC to avoid DST issues)
  const startDay = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
  const endDay = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())

  if (endDay < startDay) {
    return ''
  }

  // Inclusive day count
  const diffDays = Math.floor((endDay - startDay) / (1000 * 60 * 60 * 24)) + 1

  return `${diffDays} day${diffDays > 1 ? 's' : ''}`
}

export const monthsAndDaysBetween = (fromIso: string, toIso: string): string => {
  const fromStart = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  const from = new Date(fromIso)
  const to = new Date(toIso)
  const todayStart = fromStart(from)
  const targetStart = fromStart(to)
  if (targetStart < todayStart) {
    return 'is already passed'
  }
  if (targetStart === todayStart) {
    return 'is today'
  }
  let months = 0
  let cursor = todayStart
  while (true) {
    const nextMonth = new Date(cursor)
    nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1)
    const nextStart = Date.UTC(nextMonth.getUTCFullYear(), nextMonth.getUTCMonth(), nextMonth.getUTCDate())
    if (nextStart > targetStart) {
      break
    }
    months += 1
    cursor = nextStart
  }
  const days = Math.floor((targetStart - cursor) / (1000 * 60 * 60 * 24))
  const parts: string[] = []
  if (months > 0) {
    parts.push(`${months} month${months !== 1 ? 's' : ''}`)
  }
  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`)
  }
  return `is in ${parts.join(' and ')}`
}

/**
 * Returns "X months and Y days" from today (start of day UTC) to the given date.
 * Uses the raw sitting start ISO string (e.g. 2026-02-06T14:00).
 */
export const monthsAndDaysUntil = (sittingStart?: string): string => {
  if (!sittingStart) {
    return ''
  }
  const today = new Date()
  const todayIso = today.toISOString().slice(0, 10)
  return monthsAndDaysBetween(todayIso, sittingStart)
}

const mapCaseDetailsToHearingSummary = (hearing: HearingDetails): HearingSummary => {
  const sitting = hearing.courtSittings[0]
  const numberOfSittings = hearing.courtSittings?.length || 0
  const address = sitting?.courtHouse?.address

  return {
    hearingType: hearing?.hearingType ?? 'Unknown',
    sittingStart: formatDateTime(sitting?.sittingStart),
    sittingEnd: formatDateTime(sitting?.sittingEnd),
    sittingPeriod: `${numberOfSittings} day${numberOfSittings > 1 ? 's' : ''}`,
    trialStartInMonthsAndDays: monthsAndDaysUntil(sitting?.sittingStart),
    location: {
      courtHouseName: sitting?.courtHouse?.courtHouseName ?? '',
      courtRoomName: undefined,
      addressLines: [
        address?.address1 ?? '',
        address?.address2 ?? '',
        address?.address3 ?? '',
        address?.address4 ?? '',
      ].filter(Boolean),
      postcode: address?.postalCode ?? '',
      country: address?.country ?? 'UK',
    },
  }
}

export default mapCaseDetailsToHearingSummary
