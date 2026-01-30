export interface HearingSummary {
  hearingType: string
  sittingStart: string
  sittingEnd: string
  sittingPeriod: string
  trialStartInMonthsAndDays: string
  location: {
    courtHouseName: string
    courtRoomName: string
    addressLines: string[]
    postcode: string
    country: string
  }
}
