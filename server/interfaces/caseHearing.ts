export interface CourtSitting {
  sittingStart: string
  sittingEnd: string
  judiciaryid: string
  courtHouse: string
}

export interface Hearing {
  hearingId: string
  hearingType: string
  hearingDescription: string
  listNote: string
  courtSittings: CourtSitting[]
}

export interface CourtScheduleEntry {
  hearings: Hearing[]
}

export interface CourtSchedule {
  courtSchedule: CourtScheduleEntry[]
  courtHouse: CourtHouse
}

export interface CourtHouse {
  courtHouse: string
  courtHouseType: string
  courtHouseCode: string
  courtHouseName: string
  courtHouseDescription: string
  courtRoom: CourtRoom[]
}

export interface CourtRoom {
  courtRoomNumber: number
  courtRoomId: number
  courtRoomName: string
  venueContact: VenueContact
}

export interface VenueContact {
  venueTelephone: string
  venueEmail: string
  primaryContactName: string
  venueSupport: string
}
