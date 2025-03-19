import { CompanyEnrolled, CompanyEnrolledResponse } from "../interfaces/CompanyEnrolled";

const API_URL = "https://cco-course-catalog-api-dev.odd.works/v1";



const mapEnrolled = (data: CompanyEnrolledResponse[]): CompanyEnrolled[] => {
  return data.map((item) => ({
    companyId: item.company_id,
    companyName: item.company_name,
    codeName: item.codename,
    totalCourses: item.total_courses,
  }));
};

export const getEnrolled = async (): Promise<CompanyEnrolled[]> => {
  const response = await fetch(`${API_URL}/companies/enrolled`);
  const jsonResponse = await response.json();
  const data: CompanyEnrolledResponse[] = jsonResponse.data;

  
  return mapEnrolled(data);
};

// getEnrolled().then((data) => console.log(data)).catch((error) => console.error("Error:", error));