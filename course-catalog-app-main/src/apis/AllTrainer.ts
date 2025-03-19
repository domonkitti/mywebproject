import { Trainer } from '../interfaces/MainInterface'

const API_URL = 'https://cco-course-catalog-api-dev.odd.works/v1/trainers'
if (!API_URL) {
  console.warn('API_URL is not set.')
}
interface trainer {
    TrainerID: number;
    Nickname: string;
}
export default async function FetchTrainer(): Promise<Trainer[]> {
  try {
    const response = await fetch(API_URL)
    const preparedata = await response.json()
    const data: Trainer[] = preparedata.data.map((trainer: trainer) => ({
        trainerID: trainer.TrainerID,
        nickName: trainer.Nickname,
    }))
    return data 
  } catch (error) {
    console.error('Error fetching companies:', error)
    return [] 
  }
}
