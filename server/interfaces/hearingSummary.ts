export interface HearingSummary {
  hearingType: string
  dateTime: string
  location: {
    courtHouseName: string
    courtRoomName: string
    addressLines: string[]
    postcode: string
    country: string
  }
}
