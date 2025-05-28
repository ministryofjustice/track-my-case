export interface HearingSummary {
  hearingType: string
  dateTime: string
  location: {
    courtName: string
    courtroom: string
    addressLines: string[]
    postcode: string
  }
  contactDetails: {
    contactName: string
    telephone: string
    telephoneHours?: string
    email: string
  }
  requiresWitnessAttendance: boolean
  confirmationRequired: boolean
}
