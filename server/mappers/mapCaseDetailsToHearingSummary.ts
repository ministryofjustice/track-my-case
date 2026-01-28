import { HearingDetails } from '../interfaces/caseDetails'
import { HearingSummary } from '../interfaces/hearingSummary'

const formatDateTime = (input?: string): string => {
  if (!input) return ''
  const date = new Date(input)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
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

const mapCaseDetailsToHearingSummary = (hearing: HearingDetails): HearingSummary => {
  const sitting = hearing.courtSittings[0]
  // const room = sitting?.courtHouse?.courtRoom[0]
  const address = sitting?.courtHouse?.address

  return {
    hearingType: hearing?.hearingType ?? 'Unknown',
    sittingStart: formatDateTime(sitting?.sittingStart),
    sittingEnd: formatDateTime(sitting?.sittingEnd),
    sittingPeriod: calculateSittingPeriod(sitting?.sittingStart, sitting?.sittingEnd),
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
