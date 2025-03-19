import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import ClassTable, { ClassWithStatus } from '../components/ProjectTable'
import renderInstructors from '../utils/RenderInstructors'
import renderEmailIcon from '../utils/RenderEmailIcons'

export type ClassAPI = {
  classId: number
  courseName: string
  classCourseName: string
  startDate: Date
  endDate: Date
  maxParticipant: number
  instructorName: string[]
  userIdCount: number
  isAllEmailSent: boolean
  status: string
}

const mockClasses: ClassWithStatus[] = [
  {
    classId: 2,
    courseName: 'Introduction to Programming',
    classCourseName: 'ITP for PEA',
    startDate: new Date('2024-11-02'),
    endDate: new Date('2024-11-02'),
    instructorName: ['Jane Doe', 'โป๊ง', 'เหน่ง', 'miwtwo'],
    maxParticipant: 30,
    userIdCount: 1,
    isAllEmailSent: true,
    status: 'Done'
  },
  {
    classId: 1,
    courseName: 'Introduction to Programming',
    classCourseName: 'ITP for BTS',
    startDate: new Date('2024-11-02'),
    endDate: new Date('2024-11-20'),
    instructorName: ['Jane Doe'],
    maxParticipant: 30,
    userIdCount: 2,
    isAllEmailSent: false,
    status: 'Ongoing'
  }
]

describe('ClassTable Component', () => {
  it('renders the table with id "class-table-test"', () => {
    render(
      <BrowserRouter>
        <ClassTable classes={mockClasses} />
      </BrowserRouter>
    )
    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
    expect(tableElement).toHaveAttribute('id', 'tableheader');
  });
});

  it('renders instructor names correctly', () => {
    const { container } = render(
      renderInstructors(['John Doe', 'Jane Smith', 'Alice'])
    )
    expect(container.textContent).toContain('John Doe')
    expect(container.textContent).toContain('Jane Smith')
    expect(container.textContent).toContain('Alice')
  })

  it('renders the remaining count if more than 3 instructors', () => {
    const { container } = render(
      renderInstructors(['John', 'Jane', 'Alice', 'Bob'])
    )
    expect(container.textContent).toContain('+1')
  })
  it('displays gray icon when is_email_sent is true', () => {
    const { container } = render(
      <BrowserRouter>
        {renderEmailIcon({ classId: 1, isAllEmailSent: true })}
      </BrowserRouter>
    )

    const emailIcon = container.querySelector('span')
    expect(emailIcon).toBeInTheDocument()
    expect(emailIcon).toHaveClass('bg-gray-200')
  })
  it('displays gray icon when is_email_sent is false', () => {
    const { container } = render(
      <BrowserRouter>
        {renderEmailIcon({ classId: 2, isAllEmailSent: false })}
      </BrowserRouter>
    )

    const emailIcon = container.querySelector('a')
    expect(emailIcon).toBeInTheDocument()
    expect(emailIcon).toHaveClass('bg-blue-200')
  })

test('status should be done/upcoming/ongoing', () => {
  render(
    <BrowserRouter>
      <ClassTable classes={mockClasses} />
    </BrowserRouter>
  )

  const statusElement = document.getElementById('status')
  expect(statusElement).not.toBeNull()
  if (statusElement) {
    expect(statusElement.textContent).toMatch(/Done|Upcoming|Ongoing/)
  }
})
