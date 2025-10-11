import CourtHearingService from './courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { logger } from '../logger'
import { CaseDetails, ServiceHealth } from '../interfaces/caseDetails'

describe('CourtHearingService', () => {
  let mockGetHealth: jest.Mock
  let mockGetCaseDetailsByUrn: jest.Mock
  let service: CourtHearingService

  class MockTrackMyCaseApiClient extends TrackMyCaseApiClient {
    getHealth = jest.fn()

    getCaseDetailsByUrn = jest.fn()
  }

  beforeAll(() => {
    jest.spyOn(logger, 'debug').mockImplementation(jest.fn())
  })

  beforeEach(() => {
    jest.clearAllMocks()
    const mockClient = new MockTrackMyCaseApiClient()
    mockGetHealth = mockClient.getHealth
    mockGetCaseDetailsByUrn = mockClient.getCaseDetailsByUrn
    service = new CourtHearingService(mockClient as unknown as TrackMyCaseApiClient)
  })

  it('calls getServiceHealth', async () => {
    const mockResponse: ServiceHealth = {
      status: 'UP',
    }
    mockGetHealth.mockResolvedValue(mockResponse)

    const result = await service.getServiceHealth()

    expect(mockGetHealth).toHaveBeenCalledWith({
      path: '/health',
    })
    expect(result).toEqual(mockResponse)
  })

  it('calls getCaseDetailsByUrn', async () => {
    const urn = 'CASE123'
    const userEmail = 'example@email.com'

    const mockResponse: CaseDetails = {
      courtSchedule: [
        {
          hearings: [
            {
              hearingId: 'H123456789',
              hearingType: 'Preliminary Hearing',
              hearingDescription: 'Case management hearing for scheduling and directions',
              listNote: 'To review plea and disclosure timelines.',
              courtSittings: [
                {
                  judiciaryid: 'JUD001',
                  sittingStart: '2025-10-15T09:30:00Z',
                  sittingEnd: '2025-10-15T11:00:00Z',
                  courtHouse: {
                    courtHouseId: 'CH001',
                    courtRoomId: 'CR01',
                    courtHouseType: 'Crown Court',
                    courtHouseCode: 'CC-100',
                    courtHouseName: 'Southwark Crown Court',
                    address: {
                      address1: '1 English Grounds',
                      address2: 'Southwark',
                      address3: 'London',
                      address4: '',
                      postalCode: 'SE1 2HU',
                      country: 'UK',
                    },
                    courtRoom: [
                      {
                        courtRoomId: 1,
                        courtRoomName: 'Courtroom A',
                      },
                      {
                        courtRoomId: 2,
                        courtRoomName: 'Courtroom B',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }

    mockGetCaseDetailsByUrn.mockResolvedValue(mockResponse)

    const result = await service.getCaseDetailsByUrn(urn, userEmail)

    expect(mockGetCaseDetailsByUrn).toHaveBeenCalledWith({
      path: `/case/${urn}/casedetails`,
      userEmail,
    })
    expect(result).toEqual(mockResponse)
  })
})
