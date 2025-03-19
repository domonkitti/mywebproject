import ApiUrl from "../configs/ApiConfig";
import { ClassAPI, ClassForFrontEnd } from "../interfaces/MainInterface";

const toCamelCase = (data: ClassAPI[]): ClassForFrontEnd[] => {
  return data.map(item => ({
    classId: item.class_id,
    courseName: item.course_name,
    classCourseName: item.class_name,
    startDate: new Date(item.start_date),
    endDate: new Date(item.end_date),
    maxParticipant: item.max_participant,
    instructorName: Array.isArray(item.trainer_nickname) 
      ? item.trainer_nickname 
      : [item.trainer_nickname], 
      userIdCount: [...new Set(item.class_participant.filter(p => p.participant_id > 0).map(p => p.participant_id))].length,
    isAllEmailSent: item.class_participant.every(participant => participant.is_email_sent)
  }));
};



export const getClasss = async (): Promise<ClassForFrontEnd[]> => {
  const response = await fetch(`${ApiUrl.baseurl}/v1/classlist`);
  const jsonResponse = await response.json();
  const data: ClassAPI[] = jsonResponse.data

  return toCamelCase(data);
}
