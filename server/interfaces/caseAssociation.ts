import { z } from 'zod'

export const caseAssociationSchema = z.object({
  crn: z.string(),
  offence: z.string(),
})

export const caseAssociationsSchema = z.array(caseAssociationSchema)

export type CaseAssociation = z.infer<typeof caseAssociationSchema>
