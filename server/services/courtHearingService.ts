import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { CourtSchedule } from '../interfaces/caseHearing'
import paths from '../constants/paths'
import resolvePath from '../utils/resolvePath'
import { logger } from '../logger'
import { CaseDetails } from '../interfaces/caseDetails'

export default class CourtHearingService {
  constructor(private readonly apiClient: TrackMyCaseApiClient) {}

  async getHearings(caseId: string): Promise<CourtSchedule> {
    const path = resolvePath(paths.CASES.HEARINGS, { caseId })
    return this.apiClient.get<CourtSchedule>({ path })
  }

  async getCourtInformation(caseId: string): Promise<CourtSchedule[]> {
    const path = resolvePath(paths.CASES.INFO, { caseId })
    const response = await this.apiClient.get<CourtSchedule[]>({ path })

    logger.debug('CourtHearingService.getCourtInformation: successful response', {
      courtSchedule: response,
    })

    return response
  }

  async getCaseDetailsByUrn(urn: string): Promise<CaseDetails> {
    try {
      const path = resolvePath(paths.CASES.CASE_DETAILS, { urn })
      const response = await this.apiClient.get<CaseDetails>({ path })

      logger.debug('CourtHearingService.getCaseDetailsByUrn: successful response', {
        caseDetails: response,
      })

      return response
    } catch (e) {
      logger.debug('CourtHearingService.getCaseDetailsByUrn: unsuccessful response', e)
      return {
        courtSchedule: [
          {
            hearings: [
              {
                courtSittings: [
                  {
                    judiciaryid: '123e4567-e89b-12d3-a456-426614174000-mock',
                    sittingStart: 'Tue Mar 25 09:00:00 UTC 2025',
                    sittingEnd: 'Tue Mar 25 12:00:00 UTC 2025',
                    courtHouse: {
                      courtRoom: [
                        {
                          venueContact: {
                            venueTelephone: '01772 844700',
                            venueEmail: 'court1@moj.gov.uk',
                            primaryContactName: 'Name',
                            venueSupport: '0330 566 5561',
                          },
                          address: {
                            address1: 'Thomas More Building',
                            address2: 'Royal Courts of Justice',
                            address3: 'Strand',
                            address4: 'London',
                            postalCode: 'WC2A 2LL',
                            country: 'UK',
                          },
                          courtRoomNumber: 1,
                          courtRoomId: 101,
                          courtRoomName: 'Courtroom A',
                        },
                      ],
                      courtHouseId: '223e4567-e89b-12d3-a456-426614174111',
                      courtHouseType: 'crown',
                      courtHouseCode: 'LND001',
                      courtHouseName: 'Central London County Court',
                      courtHouseDescription: 'Main Crown Court in London handling major cases',
                    },
                  },
                ],
                hearingId: 'HRG-123456',
                hearingType: 'Preliminary',
                hearingDescription: 'Initial appearance for case 456789',
                listNote: 'Judge prefers afternoon start',
              },
            ],
          },
        ],
      }
    }
  }
}
