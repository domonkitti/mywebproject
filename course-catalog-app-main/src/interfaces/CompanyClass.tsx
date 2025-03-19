const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn('API_URL is not set. Using mock data instead.');
}


export interface CourseCompanyEnrolled {
    // course_id: number
    company_fullname: string
    course_name: string
    total_classes: number
    codename: string
  }
  
  
  