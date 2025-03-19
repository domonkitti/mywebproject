import ApiUrl from '../configs/ApiConfig'
import { Participant } from '../interfaces/MainInterface'

interface participantBackend {
  firstname_th: string
  lastname_th: string
  firstname_en: string
  lastname_en: string
  company_id: number
  email: string
}
export default async function FetchParticipants(): Promise<Participant[]> {
  try {
    const response = await fetch(`${ApiUrl.baseurl}/v1/participants/`)
    const preparedata = await response.json()
    const data: Participant[] = preparedata.data.map(
      (participant: participantBackend) => ({
        firstNameTh: participant.firstname_th,
        lastNameTh: participant.lastname_th,
        firstNameEn: participant.firstname_en,
        lastNameEn: participant.lastname_en,
        email: participant.email,
        companyId: participant.company_id
      })
    )
    return data
  } catch (error) {
    console.error('Error fetching companies:', error)
    return []
  }
}
