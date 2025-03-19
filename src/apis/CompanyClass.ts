const API_URL = 'https://cco-course-catalog-api-dev.odd.works/v1'
export interface CompanyClassDataResponse {
  course_name: string
  total_classes: number
  total_participants: number
}

export interface CompanyClassResponse {
  company_fullname: string
  company_classes: CompanyClassDataResponse[]
}

export interface CompanyClassData {
  courseName: string
  totalClasses: number
  totalParticipants: number
}

export interface CompanyClass {
  companyFullName: string
  companyClasses: CompanyClassData[]
}

export const getClasss = async (codename: string): Promise<CompanyClass> => {
  try {
    const response = await fetch(`${API_URL}/companies/enrolled/${codename}`)

    // ตรวจสอบว่า response สำเร็จหรือไม่
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const jsonResponse = await response.json()
    const apiData: CompanyClassResponse = jsonResponse.data
    console.log('jsonResponse:', jsonResponse) // ดูโครงสร้างของข้อมูล
    console.log('jsonResponse.data:', jsonResponse.data)

    // ตรวจสอบว่า jsonResponse.data เป็น array หรือไม่
    // if (!Array.isArray(jsonResponse.data.company_classes)) {
    //   throw new Error('Expected jsonResponse.data to be an array');
    // }

    const result: CompanyClass = {
      companyFullName: apiData.company_fullname,
      companyClasses:
        apiData.company_classes === null
          ? []
          : apiData.company_classes.map((i) => ({
              courseName: i.course_name,
              totalClasses: i.total_classes,
              totalParticipants: i.total_classes
            }))
    }

    return result
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error // โยนข้อผิดพลาดเพื่อให้สามารถจับในที่อื่นๆ ได้
  }
}

// ทดสอบการเรียกใช้งาน
// getClasss()
//   .then((data) => console.log(data))
//   .catch((error) => console.error("Caught error:", error));
