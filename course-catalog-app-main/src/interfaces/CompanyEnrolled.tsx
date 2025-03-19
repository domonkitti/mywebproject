const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn('API_URL is not set. Using mock data instead.');
}

export interface companyEnrolled {
    companyId: number;
    companyName: string;
    totalCourses: number;
    codeName: string;
  }
  
export interface CompanyEnrolledResponse {
    company_id: number;
    company_name: string;
    codename: string;
    total_courses: number;
  }
  
export interface CompanyEnrolled {
    companyId: number;
    companyName: string;
    totalCourses: number;
    codeName: string;
  }