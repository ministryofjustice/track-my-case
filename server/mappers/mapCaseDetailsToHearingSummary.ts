import { CaseDetails } from '../interfaces/caseDetails'
import { HearingSummary } from '../interfaces/hearingSummary'

function mapCaseDetailsToHearingSummary(data: CaseDetails): HearingSummary {
  const hearing = data.courtSchedule[0]?.hearings[0]
  const sitting = hearing?.courtSittings[0]
  const room = sitting?.courtHouse?.courtRoom[0]
  const contact = room?.venueContact

  return {
    hearingType: hearing?.hearingType ?? 'Unknown',
    dateTime: formatDateTime(sitting?.sittingStart),
    location: {
      courtName: sitting?.courtHouse?.courtHouseName ?? '',
      courtroom: room?.courtRoomName ?? '',
      addressLines: [
        room?.address?.address1 ?? '',
        room?.address?.address2 ?? '',
        room?.address?.address3 ?? '',
        room?.address?.address4 ?? '',
      ].filter(Boolean),
      postcode: room?.address?.postalCode ?? '',
    },
    contactDetails: {
      contactName: contact?.primaryContactName ?? '',
      telephone: contact?.venueTelephone ?? '',
      email: contact?.venueEmail ?? '',
      telephoneHours: '10am–5pm',
    },
    requiresWitnessAttendance: true, // hardcoded for now
    confirmationRequired: true, // hardcoded for now
  }
}

function formatDateTime(input?: string): string {
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

export default mapCaseDetailsToHearingSummary
