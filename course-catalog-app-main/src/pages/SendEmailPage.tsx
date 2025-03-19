import { useEffect, useState } from 'react'
import RichTextEditor from '../components/RichTexEditor'
import ParticipantList from '../components/ParticipantList'
import { useParams } from 'react-router-dom'
import { Class } from '../interfaces/MainInterface'
import Moodeng from '../components/Moodeng'
import { FetchClass } from '../apis/ClassId'

export default function SendEmailPage() {
  const { classId } = useParams()
  const [data, setData] = useState<Class>()
  const [checkedEmails, setCheckedEmails] = useState<any>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await FetchClass(classId)
      if (data) {
        setData(data)
      } else {
        console.log('No Data!')
      }
    }

    fetchData()
  }, [classId])

  // const mockData: ClassInfo = {
  //   class_id: 1,
  //   classcourse_name: "CCO for nothing",
  //   start_date: "1/2/64",
  //   end_date: "2/2/640",
  //   participant_list: [
  //     {
  //       company: {
  //         code_name: "PEA",
  //         company_id: 1,
  //         fullname: "PEA"
  //       },
  //       email: "test1@test.com",
  //       is_email_send: true,
  //       firstname: "Test",
  //       lastname: "Test"
  //     },
  //     {
  //       company: {
  //         code_name: "PEA",
  //         company_id: 1,
  //         fullname: "PEA"
  //       },
  //       email: "test2@test.com",
  //       is_email_send: false,
  //       firstname: "Test",
  //       lastname: "Test"
  //     },
  //     {
  //       company: {
  //         code_name: "PEA",
  //         company_id: 1,
  //         fullname: "PEA"
  //       },
  //       email: "test3@test.com",
  //       is_email_send: false,
  //       firstname: "Test",
  //       lastname: "Test"
  //     },
  //   ],
  //   trainer: [
  //     {
  //       email: 'trainer@trainer.com',
  //       firstname: 'John',
  //       lastname: 'Doe'
  //     }
  //   ]
  // }
  // useEffect(() => {
  //   setData(mockData)
  // }, [])

  return (
    <>
      {data ? (
        <div className="px-[64px]">
          <h1 className="font-bold text-4xl">{data.classCourseName}</h1>
          <p className="mt-4">
            {data.startDate} - {data.endDate}
          </p>
          <div className="flex gap-[16px] h-full">
            <RichTextEditor data={data} checkedEmails={checkedEmails} />

            <ParticipantList
              participant={data.participants}
              onCheckedEmailsChange={(e) => setCheckedEmails(e)}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          {/* <img src="https://media.tenor.com/kglDzTqoEUAAAAAM/maxwell-cat.gif" alt='maxwellcat' width={1000} /> */}
          {/* You got an easter-egg! */}
          <Moodeng />
        </div>
      )}
    </>
  )
}
