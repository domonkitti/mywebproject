import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
export interface ClassInfo {
  class_id: number
  classcourse_name: string
  start_date: string
  end_date: string
  participant_list: Array<Participant>
  trainer: Array<Trainer>
}

export interface Participant {
  company: Company
  email: string
  is_email_send: boolean
  firstname: string
  lastname: string
}

export interface Company {
  code_name: string
  company_id: number
  fullname: string
}

export interface Trainer {
  email: string
  firstname: string
  lastname: string
}

const mockData: ClassInfo = {
  class_id: 1,
  classcourse_name: 'CCO for nothing',
  start_date: '1/2/64',
  end_date: '2/2/640',
  participant_list: [
    {
      company: {
        code_name: 'PEA',
        company_id: 1,
        fullname: 'PEA'
      },
      email: 'test1@test.com',
      is_email_send: true,
      firstname: 'Test',
      lastname: 'Test'
    },
    {
      company: {
        code_name: 'PEA',
        company_id: 1,
        fullname: 'PEA'
      },
      email: 'test2@test.com',
      is_email_send: false,
      firstname: 'Test',
      lastname: 'Test'
    },
    {
      company: {
        code_name: 'PEA',
        company_id: 1,
        fullname: 'PEA'
      },
      email: 'test3@test.com',
      is_email_send: false,
      firstname: 'Test',
      lastname: 'Test'
    }
  ],
  trainer: [
    {
      email: 'trainer@trainer.com',
      firstname: 'John',
      lastname: 'Doe'
    }
  ]
}

const EmailContent = ({ data }: { data: ClassInfo }) => {
  return (
    <p>
      สวัสดี คุณ {data.participant_list[0]?.firstname}{' '}
      {data.participant_list[0]?.lastname} <br />
      ยินดีต้อนรับสู่ class {data.classcourse_name} <br />
      ก่อนเริ่ม class กันในวันที่ {data.start_date} <br />
      อยากจะให้คุณเตรียมตัวดังนี้... <br />
      <br />
      แล้วเจอกันครับ {data.trainer[0].firstname} {data.trainer[0].lastname}
    </p>
  )
}

describe('EmailContent Component', () => {
  it('renders email content correctly', () => {
    render(<EmailContent data={mockData} />)

    // ตรวจสอบว่าข้อความใน <p> ถูกต้อง
    expect(screen.getByText(/สวัสดี คุณ Test Test/i)).toBeInTheDocument()
    expect(
      screen.getByText(/ยินดีต้อนรับสู่ class CCO for nothing/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/ก่อนเริ่ม class กันในวันที่ 1\/2\/64/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/แล้วเจอกันครับ John Doe/i)).toBeInTheDocument()
  })
})
