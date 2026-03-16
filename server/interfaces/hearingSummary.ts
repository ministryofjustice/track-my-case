export interface HearingStartDateMessage {
  title: string
  description: string
}

export interface HearingSummary {
  hearingOption: 'COURT_SITTINGS' | 'WEEK_COMMENCING' | 'UNKNOWN'
  hearingType: string
  sittingStart: string
  sittingEnd: string
  sittingPeriod: string
  sittingPeriodTooltip?: string
  hearingStartDateMessage?: HearingStartDateMessage
  location: {
    courtHouseName: string
    courtRoomName?: string
    addressLines: string[]
    postcode: string
    country: string
  }
}

export const HEARING_TYPE = {
  TRIAL: 'Trial',
  SENTENCE: 'Sentence',
}
