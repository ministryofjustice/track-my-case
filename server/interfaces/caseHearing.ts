export interface CourtSitting {
  courtHouse: string
  judiciaryid: string
  sittingStart: string
  sittingEnd: string
}

export interface Hearing {
  hearingId: string
  hearingType: string
  hearingDescription: string
  listNote: string
  courtSittings: CourtSitting[]
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

export interface CourtSchedule {
  hearings: Hearing[]
  courtHouse: CourtHouse
}
