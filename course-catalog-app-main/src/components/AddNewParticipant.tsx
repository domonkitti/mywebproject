//AddNewParticipant.tsx
import React, { useEffect, useState } from 'react'
import { Company } from '../interfaces/MainInterface'
import { CreateParticipant } from '../apis/CreateParticipant'

interface AddNewParticipantProps {
  companies: Company[]
  show: boolean
  onClose: () => void
}

const AddNewParticipant: React.FC<AddNewParticipantProps> = ({
  companies,
  show,
  onClose
}) => {
  //const [company, setCompany] = useState<string>('')
  const [formData, setFormData] = useState({
    firstname_th: '',
    lastname_th: '',
    firstname_en: '',
    lastname_en: '',
    email: '',
    company_id: 0
  })

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() => {
    console.log(formData)
  }, [formData])

  const handleSave = async () => {
    //console.log("Form Data:", formData)
    await CreateParticipant(formData)
    onClose()
    setFormData({
      firstname_th: '',
      lastname_th: '',
      firstname_en: '',
      lastname_en: '',
      email: '',
      company_id: 0
    });
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-1/3 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Participant
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="crud-modal"
            onClick={onClose}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <form onSubmit={handleSave} className="p-4 md:p-5">
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-5 sm:col-span-1">
              <label
                htmlFor="firstname_th"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Firstname (TH)
              </label>
              <input
                type="text"
                name="firstname_th"
                id="firstname_th"
                value={formData.firstname_th}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Firstname (TH)"
                required
              />
            </div>
            <div className="col-span-5 sm:col-span-1">
              <label
                htmlFor="lastname_th"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Lastname (TH)
              </label>
              <input
                type="text"
                name="lastname_th"
                id="lastname_th"
                value={formData.lastname_th}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Lastname (TH)"
                required
              />
            </div>
            <div className="col-span-5 sm:col-span-1">
              <label
                htmlFor="firstname_en"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Firstname (EN)
              </label>
              <input
                type="text"
                name="firstname_en"
                id="firstname_en"
                value={formData.firstname_en}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Firstname (EN)"
                required
              />
            </div>
            <div className="col-span-5 sm:col-span-1">
              <label
                htmlFor="lastname_en"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Lastname (EN)
              </label>
              <input
                type="text"
                name="lastname_en"
                id="lastname_en"
                value={formData.lastname_en}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Lastname (EN)"
                required
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                E-mail
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="abc@www.com"
                required
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="company_id"
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                Company
              </label>
              <select
                name="company_id"
                id="company_id"
                value={formData.company_id}
                className="border border-gray-500 rounded-lg p-2 w-full"
                onChange={handleCompanyChange}
                required
              >
                <option disabled value="0">
                  Select a company
                </option>
                {companies.map((company) => (
                  <option key={company.companyId} value={company.companyId}>
                    {company.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave} 
            className="text-white inline-flex justify-center items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full"
          >
            <svg
              className="me-1 -ms-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Add New Participant
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddNewParticipant