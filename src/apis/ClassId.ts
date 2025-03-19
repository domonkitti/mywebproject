import ApiUrl from "../configs/ApiConfig"
import { Class } from "../interfaces/MainInterface";

export async function FetchClass(param: string | undefined): Promise<Class | null> {
  try {
    if (!param) {
      return null
    }
    const result = await fetch(`${ApiUrl.baseurl}/v1/email/classinfo?class_id=${param}`)

    if (!result.ok) {
      console.log(`Error Status ${result.status}`)
      
      return null
    }

    const json = await result.json()
    const data = json.data

    const dataMap: Class = {
      classId: data.class_id,
      classCourseName: data.classcourse_name,
      startDate: data.start_date,
      endDate: data.end_date,
      participants: data.participant_list.map((participant: any) => ({
        firstNameTh: participant.firstname_th,
        lastNameTh: participant.lastname_th,
        firstNameEn: participant.firstname_en,
        lastNameEn: participant.lastname_en,
        email: participant.email,
        company: {
          companyId: participant.company.company_id,
          codeName: participant.company.code_name,
          fullName: participant.company.fullname
        },
        isEmailSend: participant.is_email_send
      })),
      trainers: data.trainer_list.map((trainer: any) => ({
        nickName: trainer.nickname,
        firstName: trainer.firstname,
        lastName: trainer.lastname,
        email: trainer.email,
        isEmailSend: trainer.is_email_send
      })),
    }
    return dataMap
  } catch (error) {
    console.log(error)
    return null
  }
}
