import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import CompanyList from '../components/CompanyEnrolled'
import { beforeEach, describe, expect, test } from 'vitest'
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: jest.fn(),
// }));

const mockData = [
  {
    company_id: 4,
    company_name: 'Advanced Info Service',
    codename: 'AIS',
    total_courses: 0
  },
  {
    company_id: 10,
    company_name: 'Bangkok Dusit Medical Services',
    codename: 'BDMS',
    total_courses: 0
  },
  {
    company_id: 9,
    company_name: 'Bank of Ayudhya (Krungsri)',
    codename: 'BAY',
    total_courses: 0
  },
  {
    company_id: 6,
    company_name: 'CP All Public Company Limited',
    codename: 'CPALL',
    total_courses: 0
  },
  {
    company_id: 2,
    company_name: 'Electricity Generating Authority of Thailand',
    codename: 'EGAT',
    total_courses: 1
  },
  {
    company_id: 8,
    company_name: 'Kasikorn Bank',
    codename: 'KBANK',
    total_courses: 0
  },
  {
    company_id: 1,
    company_name: 'Provincial Electricity Authority',
    codename: 'PEA',
    total_courses: 2
  },
  {
    company_id: 3,
    company_name: 'PTT Public Company Limited',
    codename: 'PTT',
    total_courses: 0
  },
  {
    company_id: 7,
    company_name: 'Siam Commercial Bank',
    codename: 'SCB',
    total_courses: 0
  },
  {
    company_id: 5,
    company_name: 'True Corporation',
    codename: 'TRUE',
    total_courses: 0
  }
]

describe('CompanyList Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <CompanyList />
      </BrowserRouter>
    )
  })

  test('renders Company Enrolled List title', () => {
    const titleElement = screen.getByText(/Company Enrolled List/i)
    expect(titleElement).toBeInTheDocument()
  })

  test('renders search input and button', () => {
    const searchInput = screen.getByPlaceholderText('Search')
    const searchButton = screen.getByRole('button', { name: /Search/i })
    expect(searchInput).toBeInTheDocument()
    expect(searchButton).toBeInTheDocument()
  })

  test('renders all companies from mockData initially', async () => {
    for (const company of mockData) {
      // Await the element that matches the company's name to ensure it renders asynchronously
      expect(await screen.findByText(company.company_name)).toBeInTheDocument()

      // Fetch elements showing the company's total courses and check that at least one is found
      const totalCoursesElements = await screen.findAllByText(
        company.total_courses.toString()
      )
      expect(totalCoursesElements.length).toBeGreaterThan(0)
    }
  })

  test('filters companies based on search input', async () => {
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, {
      target: { value: 'Provincial Electricity Authority' }
    })
    fireEvent.click(screen.getByRole('button', { name: /Search/i }))

    await screen.findByText('Provincial Electricity Authority')

    expect(
      screen.getByText('Provincial Electricity Authority')
    ).toBeInTheDocument()
    console.log(screen.debug())
  })

  test('displays "No Data Found!" when no matching companies found', () => {
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Company' } })
    fireEvent.click(screen.getByRole('button', { name: /Search/i }))

    expect(screen.getByText('No Data Found!')).toBeInTheDocument()
  })
  //   test('calls navigate with the correct codename when View button is clicked', () => {
  //   // Cast useNavigate as a Jest mock function to allow mock methods
  //   const navigateMock = useNavigate as jest.Mock;

  //   navigateMock.mockImplementation(() => jest.fn());

  //   render(<CompanyList />);

  //   const viewButton = screen.getAllByRole('button', { name: /View/i })[0];
  //   fireEvent.click(viewButton);

  //   // Assert that navigate was called with the expected argument
  //   expect(navigateMock).toHaveBeenCalledWith('/course/company/pea');
  // });
})
