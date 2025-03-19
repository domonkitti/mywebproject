import React, { useEffect, useState } from 'react'
import { CompanyClass, getClasss } from '../apis/CompanyClass'
import { Table } from 'flowbite-react'
import { useParams } from 'react-router-dom'

const CompanyList1: React.FC = () => {
  const { codename } = useParams<{ codename: string }>()
  const [companies, setCompanies] = useState<CompanyClass>()
  const [search, setSearch] = useState<string>('') // เพิ่ม state สำหรับ search
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyClass>() // State สำหรับผลการค้นหา

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getClasss(codename || '')
        setCompanies(data)
        setFilteredCompanies(data) // ตั้งค่า filteredCompanies เป็นข้อมูลที่ดึงมา
      } catch (error) {
        console.error('Caught error:', error)
      }
    }

    fetchCompanies()
  }, [codename])

  useEffect(() => {
    if (companies) {
      const filtered = {
        ...companies,
        companyClasses: companies.companyClasses.filter((course) =>
          course.courseName.toLowerCase().includes(search.toLowerCase())
        )
      }
      setFilteredCompanies(filtered)
    }
  }, [search, companies])

  return (
    <div className="flex">
      <div className="px-6 bg-white w-full">
        <h2 className="text-2xl mb-4 text-blue-600 font-normal">
          <div>
            <p>{filteredCompanies?.companyFullName}</p>
          </div>
        </h2>

        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/4 rounded-3xl text-black"
          />
        </div>

        {filteredCompanies?.companyClasses.length === 0 ? (
          <div className="text-center text-black text-2xl text-bold mt-4">
            No Data Found!
          </div>
        ) : (
          <Table hoverable className="text-lg">
            <Table.Head>
              <Table.HeadCell className="text-start pl-20 text-gray-700">
                Course Name
              </Table.HeadCell>
              <Table.HeadCell className="text-start text-gray-700">
                Total Class
              </Table.HeadCell>
              <Table.HeadCell className="text-start text-gray-700">
                Total Participant
              </Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y justify-center">
              {filteredCompanies?.companyClasses.map((company) => (
                <Table.Row key={company.courseName} className="bg-white p-10">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-600 pl-20 pb-3 pt-3 text-start">
                    {company.courseName}
                  </Table.Cell>
                  <Table.Cell className="text-start pl-14 text-gray-600">
                    {company.totalClasses}
                  </Table.Cell>
                  <Table.Cell className="text-start pl-14 text-gray-600">
                    {company.totalParticipants}
                  </Table.Cell>
                  <Table.Cell className="flex"></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  )
}

export default CompanyList1
