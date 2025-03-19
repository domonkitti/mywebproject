import { Button, Table } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { companyEnrolled } from '../interfaces/CompanyEnrolled'
import { getEnrolled } from '../apis/CompanyEnrolled'

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<companyEnrolled[]>([])
  const [search, setSearch] = useState<string>('')
  const navigate = useNavigate()

  const compareCompanyName = (a: companyEnrolled, b: companyEnrolled) => {
    const isAEnglish = /^[A-Za-z]/.test(a.companyName)
    const isBEnglish = /^[A-Za-z]/.test(b.companyName)

    if (isAEnglish && !isBEnglish) return -1
    if (!isAEnglish && isBEnglish) return 1
    return a.companyName.localeCompare(b.companyName, 'en', {
      sensitivity: 'base'
    })
  }

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getEnrolled()
        const filteredCompanies = data
          .filter((company) =>
            company.companyName.toLowerCase().includes(search.toLowerCase())
          )
          .sort(compareCompanyName)

        setCompanies(filteredCompanies)
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }

    fetchCompanies()
  }, [search])

  const handleView = (codename: string) => {
    navigate(`/course/company/${codename}`)
  }

  const handleSearch = async () => {
    if (search.trim() === '') {
      try {
        const data = await getEnrolled()
        setCompanies(data)
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    } else {
      try {
        const data = await getEnrolled()
        const filteredCompanies = data.filter((company) =>
          company.companyName.toLowerCase().includes(search.toLowerCase())
        )
        setCompanies(filteredCompanies)
      } catch (error) {
        console.error('Error filtering companies:', error)
      }
    }
  }

  return (
    <div className="flex">
      <div className="px-6 bg-white w-full">
        <h2 className="text-2xl mb-4 text-blue-600 font-normal">
          Company Enrolled List
        </h2>

        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/4 rounded-3xl text-black"
          />
          <Button
            className="border rounded-3xl bg-blue-600"
            color="blue"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

        {companies.length === 0 ? (
          <div className="text-center text-black text-2xl text-bold mt-4">
            No Data Found!
          </div>
        ) : (
          <Table hoverable className="text-lg">
            <Table.Head>
              <Table.HeadCell className="text-start pl-20 text-gray-700">
                Company Name
              </Table.HeadCell>
              <Table.HeadCell className="text-start text-gray-700">
                Total Course
              </Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y justify-center">
              {companies.map((company) => (
                <Table.Row key={company.companyId} className="bg-white p-10">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-600 pl-20 pb-3 pt-3 text-start">
                    {company.companyName}
                  </Table.Cell>
                  <Table.Cell className="text-start pl-16 text-gray-600">
                    {company.totalCourses}
                  </Table.Cell>
                  <Table.Cell className="flex pt-1.5 ">
                    <Button
                      onClick={() => handleView(company.codeName)}
                      className="  bg-blue-600 text-white rounded-xl hover:bg-blue-800  "
                      size="xs"
                    >
                      <svg
                        className="w-[18px] h-[18px] mt-1 mr-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="2"
                          d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                        />
                      </svg>
                      View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  )
}

export default CompanyList
