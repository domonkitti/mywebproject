import ApiUrl from '../configs/ApiConfig'
import { Course } from '../interfaces/MainInterface'

interface courseBackend {
  CourseID: number
  CourseName: string
  CourseOutline: string
}
export default async function FetchCourses(): Promise<Course[]> {
  try {
    //${ApiUrl.baseurl}
    const response = await fetch(`${ApiUrl.baseurl}/v1/courses/`)
    const preparedata = await response.json()
    const data: Course[] = preparedata.map((course: courseBackend) => ({
      CourseID: course.CourseID,
      CourseName: course.CourseName,
      CourseOutline: course.CourseOutline
    }))
    return data // Return the data array
  } catch (error) {
    console.error('Error fetching courses:', error)
    return [] // Return an empty array in case of an error
  }
}
