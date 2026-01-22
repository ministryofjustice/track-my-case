import { z } from 'zod'

export const addressSchema = z.object({
  address1: z.string(),
  address2: z.string(),
  address3: z.string(),
  address4: z.string(),
  postalCode: z.string(),
  country: z.string(),
})

export const courtRoomSchema = z.object({
  courtRoomId: z.number(),
  courtRoomName: z.string(),
})

export const courtHouseSchema = z.object({
  address: addressSchema,
  courtRoom: z.array(courtRoomSchema),
  courtHouseId: z.string(),
  courtRoomId: z.string(),
  courtHouseType: z.string(),
  courtHouseCode: z.string(),
  courtHouseName: z.string(),
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

export const caseDetailsResponseSchema = z.object({
  caseDetails: caseDetailsSchema.optional(),
  statusCode: z.number(),
  message: z.string().optional().nullable(),
})

export type CaseDetails = z.infer<typeof caseDetailsSchema>
export type CaseDetailsResponse = z.infer<typeof caseDetailsResponseSchema>

export const applicationInfoSchema = z.object({
  productId: z.string(),
})

export type ApplicationInfo = z.infer<typeof applicationInfoSchema>

export const apiServiceHealthSchema = z.object({
  status: z.string(),
})

export type ApiServiceHealth = z.infer<typeof apiServiceHealthSchema>

export const serviceHealthSchema = z.object({
  status: z.string(),
  reason: z.string().optional().nullable(),
  application: applicationInfoSchema.optional().nullable(),
})

export type ServiceHealth = z.infer<typeof serviceHealthSchema>
