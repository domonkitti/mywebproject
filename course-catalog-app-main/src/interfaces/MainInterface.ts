export interface Company {
  companyId: number
  codeName: string
  fullName: string
}

export interface Trainer {
  trainerId: string
  nickName: string
  firstName: string
  lastName: string
  email: string
  isEmailSend: boolean
}

export interface Participant {
  firstNameTh: string
  lastNameTh: string
  firstNameEn: string
  lastNameEn: string
  email: string
  companyId: number
  isEmailSend: boolean
}

export interface Class {
  classId: number
  classCourseName: string
  startDate: string
  endDate: string
  participants: Participant[]
  trainers: Trainer[]
}

export interface ClassAPI {
  class_id: number
  class_name: string
  start_date: Date
  course_name: string
  end_date: Date
  max_participant: number
  trainer_firstname: string | null
  trainer_nickname: string[]
  class_participant: {
    participant_id: number
    is_email_sent: boolean
  }[]
}

export interface ClassForFrontEnd {
  classId: number
  courseName: string
  classCourseName: string
  startDate: Date
  endDate: Date
  maxParticipant: number
  instructorName: string[]
  userIdCount: number
  isAllEmailSent: boolean
}

export interface Course {
  CourseID: number
  CourseName: string
  CourseOutline: string
}
