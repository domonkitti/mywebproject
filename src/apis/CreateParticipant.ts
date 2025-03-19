//import { Participant } from '../interfaces/MainInterface'

//const API_URL = import.meta.env.VITE_API_URL;
const API_URL = 'https://cco-course-catalog-api-dev.odd.works/v1/participants/'
if (!API_URL) {
  console.warn('API_URL is not set.')
}
interface participantBackend {
firstname_th: string,
lastname_th: string,
firstname_en: string,
lastname_en: string,
company_id: number,
email: string
}
export async function CreateParticipant(newParticipant: participantBackend): Promise<participantBackend | null> {
  try {
    console.log(newParticipant)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newParticipant),
    })

    if (!response.ok) {
      console.error('Failed to add participant:', response.statusText)
      return null
    }

    const result = await response.json()
    return result as participantBackend
  } catch (error) {
    console.error('Error adding participant:', error)
    return null
  }
}
