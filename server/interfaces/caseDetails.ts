import { z } from 'zod'

export const addressSchema = z.object({
  address1: z.string(),
  address2: z.string(),
  address3: z.string(),
  address4: z.string(),
  postalCode: z.string(),
  country: z.string(),
})

export const venueContactSchema = z.object({
  venueTelephone: z.string(),
  venueEmail: z.string(),
  primaryContactName: z.string(),
  venueSupport: z.string(),
})

export const courtRoomSchema = z.object({
  courtRoomNumber: z.number(),
  courtRoomId: z.number(),
  courtRoomName: z.string(),
  venueContact: venueContactSchema,
  address: addressSchema,
})

export const courtHouseSchema = z.object({
  courtHouseId: z.string(),
  courtHouseType: z.string(),
  courtHouseCode: z.string(),
  courtHouseName: z.string(),
  courtHouseDescription: z.string(),
  courtRoom: z.array(courtRoomSchema),
})

export const courtSittingSchema = z.object({
  judiciaryid: z.string(),
  sittingStart: z.string(),
  sittingEnd: z.string(),
  courtHouse: courtHouseSchema,
})

export const hearingSchema = z.object({
  hearingId: z.string(),
  hearingType: z.string(),
  hearingDescription: z.string(),
  listNote: z.string(),
  courtSittings: z.array(courtSittingSchema),
})

export const courtScheduleSchema = z.object({
  hearings: z.array(hearingSchema),
})

export const caseDetailsSchema = z.object({
  courtSchedule: z.array(courtScheduleSchema),
})

export type CaseDetails = z.infer<typeof caseDetailsSchema>
