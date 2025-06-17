import paths from '../constants/paths'
import resolvePath from '../utils/resolvePath'
import CaseAssociationService from './caseAsscociationService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { CaseAssociation } from '../interfaces/caseAssociation'

jest.mock('../data/trackMyCaseApiClient')

describe('CaseAssociationService', () => {
  const mockSub = '1234567891011'
  const mockResponse: CaseAssociation[] = [
    { crn: '1234567891011', offence: 'Theft' },
    { crn: '1110987654321', offence: 'Burglary' },
  ]

  let apiClient: TrackMyCaseApiClient
  let service: CaseAssociationService

  beforeEach(() => {
    jest.resetAllMocks()
    apiClient = new TrackMyCaseApiClient()
    ;(apiClient.get as jest.Mock).mockResolvedValue(mockResponse)
    service = new CaseAssociationService(apiClient)
  })

  it('should return validated case associations', async () => {
    const result = await service.getCaseAssociations(mockSub)

    expect(apiClient.get).toHaveBeenCalledWith({ path: resolvePath(paths.CASES.ASSOCIATIONS, { sub: mockSub }) })
    expect(result).toEqual(mockResponse)
  })

  it('should throw if response is invalid', async () => {
    const invalidResponse = [{ crn: 123 }]
    ;(apiClient.get as jest.Mock).mockResolvedValue(invalidResponse)

    await expect(service.getCaseAssociations(mockSub)).rejects.toThrow('Invalid case associations response')
  })
})
