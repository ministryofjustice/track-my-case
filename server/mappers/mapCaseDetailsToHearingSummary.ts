import { CaseDetails } from '../interfaces/caseDetails'
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

const mapCaseDetailsToHearingSummary = (data: CaseDetails): HearingSummary => {
  const hearing = data?.courtSchedule[0]?.hearings[0]
  const sitting = hearing?.courtSittings[0]
  const room = sitting?.courtHouse?.courtRoom[0]
  const address = sitting?.courtHouse?.address

  return {
    hearingType: hearing?.hearingType ?? 'Unknown',
    dateTime: formatDateTime(sitting?.sittingStart),
    location: {
      courtHouseName: sitting?.courtHouse?.courtHouseName ?? '',
      courtRoomName: room?.courtRoomName ?? '',
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
