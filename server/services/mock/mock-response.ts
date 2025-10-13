import { CaseDetails } from '../../interfaces/caseDetails'

export const getMockCaseDetails = (): CaseDetails => {
  return {
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
}

export default { getMockCaseDetails }
