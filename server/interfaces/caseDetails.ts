import { z } from 'zod'

export const addressSchema = z.object({
  address1: z.string(),
  address2: z.string().optional(),
  address3: z.string().optional(),
  address4: z.string().optional(),
  postalCode: z.string(),
  country: z.string(),
})

export const courtRoomSchema = z.object({
  courtRoomId: z.number(),
  courtRoomName: z.string(),
})

export const courtHouseBasicSchema = z.object({
  address: addressSchema,
  courtHouseId: z.string(),
  courtHouseType: z.string(),
  courtHouseCode: z.string(),
  courtHouseName: z.string(),
})

export const courtHouseWithCourtRoomSchema = courtHouseBasicSchema.extend({
  courtRoom: z.array(courtRoomSchema),
  courtRoomId: z.string(),
})

export const courtSittingSchema = z.object({
  judiciaryId: z.string(),
  sittingStart: z.string(),
  sittingEnd: z.string(),
  courtHouse: courtHouseWithCourtRoomSchema,
})

export const weekCommencingSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  durationInWeeks: z.number(),
  courtHouse: courtHouseBasicSchema,
})

export const hearingSchema = z.object({
  hearingId: z.string(),
  hearingType: z.string(),
  hearingDescription: z.string(),
  listNote: z.string().optional(),
  weekCommencing: weekCommencingSchema.optional(),
  courtSittings: z.array(courtSittingSchema).optional(),
})
export type HearingDetails = z.infer<typeof hearingSchema>
export type CourtSitting = z.infer<typeof courtSittingSchema>

export const courtScheduleSchema = z.object({
  hearings: z.array(hearingSchema),
})

export const caseDetailsSchema = z.object({
  caseUrn: z.string(),
  caseStatus: z.string(),
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
