import { Table } from 'flowbite-react'
import { NavLink } from 'react-router-dom'
import { IoPencil } from 'react-icons/io5'
import renderInstructors from '../utils/RenderInstructors'
import dayjs from 'dayjs'
import renderEmailIcon from '../utils/RenderEmailIcons'
import { ClassForFrontEnd } from '../interfaces/MainInterface'

export interface ClassWithStatus extends ClassForFrontEnd {
  status: string
}

export interface ClassTableProps {
  classes: ClassWithStatus[]
}

const formatDate = (date: Date) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const ClassTable: React.FC<ClassTableProps> = ({ classes }) => {
  return (
    <div className="overflow-x-auto">
      <Table id="tableheader" striped>
        <Table.Head className="bg-gray-100 text-gray-700">
          <Table.HeadCell className="w-1 text-center">ID</Table.HeadCell>
          <Table.HeadCell className="w-12 text-center">Class</Table.HeadCell>
          <Table.HeadCell className="w-20 text-center">Course</Table.HeadCell>
          <Table.HeadCell className="w-20 text-center">
            Start Date
          </Table.HeadCell>
          <Table.HeadCell className="w-20 text-center">End Date</Table.HeadCell>
          <Table.HeadCell className="w-20 text-center">
            Instructors
          </Table.HeadCell>
          <Table.HeadCell className="w-20 text-center">
            Participants
          </Table.HeadCell>
          <Table.HeadCell className="w-20 text-center">Status</Table.HeadCell>
          <Table.HeadCell className="w-5 text-center"></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {classes.map((classItem) => (
            <Table.Row
              key={classItem.classId}
              data-testid={`row-${classItem.classId}`}
              className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
            >
              <Table.Cell
                id="classid"
                className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
              >
                {classItem.classId}
              </Table.Cell>
              <Table.Cell id="classname">
                {classItem.classCourseName}
              </Table.Cell>
              <Table.Cell id="course">{classItem.courseName}</Table.Cell>
              <Table.Cell id="startdate">
                {formatDate(classItem.startDate)}
              </Table.Cell>
              <Table.Cell id="enddate">
                {formatDate(classItem.endDate)}
              </Table.Cell>
              <Table.Cell id="instructors">
                {renderInstructors(classItem.instructorName)}
              </Table.Cell>
              <Table.Cell id="participant">
                {classItem.userIdCount}/{classItem.maxParticipant}
              </Table.Cell>
              <Table.Cell id="status" className="font-bold text-lg">
                {classItem.status}
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-col items-center space-y-2">
                  <NavLink
                    // to={`#/class/${classItem.classId}`}
                    to={`#`}
                    className="bg-green-200 p-2 rounded-full text-green-600 hover:bg-green-300"
                  >
                    <IoPencil className="h-5 w-5" />
                  </NavLink>
                  {renderEmailIcon({
                    classId: classItem.classId,
                    isAllEmailSent: classItem.isAllEmailSent
                  })}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ClassTable
