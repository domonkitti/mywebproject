import ParticipantNameListModal from '../components/ParticipantNameListModal'
import TrainerNameListModal from '../components/TrainerNameListModal'
import React, { useEffect, useState } from 'react'
import { Company } from '../interfaces/MainInterface'
import ParticipantNumber from '../components/ParticipantNumber'
import { Participant, Trainer, Course } from '../interfaces/MainInterface'
import FetchCompanies from '../apis/AllCompany'
import FetchCourses from '../apis/AllCourse'
import FetchParticipants from '../apis/AllParticipant'
import FetchTrainer from '../apis/AllTrainer'

type BodyData = {
  start_date: string
  end_date: string
  company: string
  course: string
  trainer: string[]
  participant: string[]
}

export default function CreateClass() {
  const [bodyData, setBodyData] = useState<BodyData>({
    start_date: '',
    end_date: '',
    company: '',
    course: '',
    trainer: [],
    participant: []
  })

  const [companies, setCompanies] = useState<Company[]>([])
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response: Company[] = await FetchCompanies()
        setCompanies(response)
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }
    fetchCompanies()
  }, [])

  const [courses, setCourses] = useState<Course[]>([])
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response: Course[] = await FetchCourses()
        setCourses(response)
      } catch (error) {
        console.error('Error fetching Course:', error)
      }
    }
    fetchCourses()
  }, [])

  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false)
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false)

  const [trainerNames, setTrainerNames] = useState<string[]>([])
  const [participantNames, setParticipantNames] = useState<string[]>([])

  const [selectedTrainers, setSelectedTrainers] = useState<string[]>([])
  const [addedTrainers, setAddedTrainers] = useState<string[]>([])

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const numberParticipants = selectedParticipants.length
  const [addedParticipants, setAddedParticipants] = useState<string[]>([])

  const fetchTrainerNames = async () => {
    try {
      const response: Trainer[] = await FetchTrainer()
      setTrainerNames(response.map((trainer) => trainer.nickName))
    } catch (error) {
      console.error('Error fetching names:', error)
    }
  }

  const fetchParticipantNames = async () => {
    try {
      const response: Participant[] = await FetchParticipants()
      setParticipantNames(response.map((name)=>name.firstNameTh+' '+name.lastNameTh+' '+name.email))
    } catch (error) {
      console.error('Error fetching names:', error)
    }
  }

  useEffect(() => {
    if (isTrainerModalOpen) {
      fetchTrainerNames()
    }
    if (isParticipantModalOpen) {
      fetchParticipantNames()
    }
  }, [isTrainerModalOpen, isParticipantModalOpen])

  const handleAddTrainer = (name: string) => {
    if (!selectedTrainers.includes(name)) {
      const updatedTrainers = [...selectedTrainers, name]
      setSelectedTrainers((prev) => [...prev, name])
      setAddedTrainers((prev) => [...prev, name])
      setBodyData((prev) => ({
        ...prev,
        trainer: updatedTrainers
      }))
    }
  }

  const handleRemoveTrainer = (name: string) => {
    const updatedTrainers = selectedTrainers.filter(
      (trainer) => trainer !== name
    )
    setSelectedTrainers((prev) => prev.filter((trainer) => trainer !== name))
    setAddedTrainers((prev) => prev.filter((trainer) => trainer !== name))
    setBodyData((prev) => ({
      ...prev,
      trainer: updatedTrainers
    }))
  }

  const handleAddParticipant = (name: string) => {
    if (!selectedParticipants.includes(name)) {
      setSelectedParticipants((prev) => [...prev, name])
      setAddedParticipants((prev) => [...prev, name])
    }
  }

  const handleRemoveParticipant = (name: string) => {
    setSelectedParticipants((prev) =>
      prev.filter((participant) => participant !== name)
    )
    setAddedParticipants((prev) =>
      prev.filter((participant) => participant !== name)
    )
  }

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    setStartDate('')
    setEndDate('')
  }, [today])

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStartDate = e.target.value
    setStartDate(selectedStartDate)

    if (endDate < selectedStartDate) {
      setEndDate(selectedStartDate)
      setBodyData((prev) => ({
        ...prev,
        start_date: selectedStartDate,
        end_date: selectedStartDate
      }))
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedEndDate = e.target.value
    setEndDate(selectedEndDate)
    setBodyData((prev) => ({
      ...prev,
      end_date: selectedEndDate
    }))
  }

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBodyData((prev) => ({
      ...prev,
      company: e.target.value
    }))
  }

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBodyData((prev) => ({
      ...prev,
      course: e.target.value
    }))
  }

  useEffect(() => {}, [bodyData])

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (startDate === '') {
      alert('Please select a start date before saving.')
      return
    }
    alert('Saved')
  }

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-4xl font-bold">New Class</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center gap-x-3">
            <p>Course</p>
            <select
              className="border border-gray-500 rounded-lg p-2 w-[300px]"
              onChange={handleCourseChange}
            >
              <option disabled>Pick a course</option>
              {courses.map((courses) => (
                <option key={courses.CourseID} value={courses.CourseName}>
                  {courses.CourseName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-x-3">
            <input
              className="border rounded-lg p-1 border-gray-500"
              type="date"
              value={startDate}
              min={today}
              onChange={handleStartDateChange}
              required
            />
            <p>To</p>
            <input
              className="border rounded-lg p-1 border-gray-500"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              disabled={!startDate}
              min={startDate}
              required
            />
          </div>
          <div className="flex items-center gap-x-3">
            <p>Company</p>
            <select
              className="border border-gray-500 rounded-lg p-2 w-[300px]"
              onChange={handleCompanyChange}
            >
              <option disabled>Pick a company</option>
              {companies.map((company) => (
                <option key={company.companyId} value={company.fullName}>
                  {company.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Trainers</h3>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsTrainerModalOpen(true)
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-fit"
          >
            + Add
          </button>
          {isTrainerModalOpen && (
            <TrainerNameListModal
              names={trainerNames}
              onClose={() => setIsTrainerModalOpen(false)}
              onAdd={handleAddTrainer}
              addedTrainers={addedTrainers}
            />
          )}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Selected Trainers:</h3>
            <ul className="list-disc pl-5 flex flex-col gap-y-2">
              {selectedTrainers.map((trainer) => (
                <li key={trainer}>
                  {trainer}
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg w-fit hover:text-black ml-4"
                    onClick={() => handleRemoveTrainer(trainer)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            {ParticipantNumber(numberParticipants)}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Participants:</h3>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setIsParticipantModalOpen(true)
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-fit"
              >
                + Add
              </button>
              {isParticipantModalOpen && (
                <ParticipantNameListModal
                  names={participantNames}
                  onClose={() => setIsParticipantModalOpen(false)}
                  onAdd={handleAddParticipant}
                  addedParticipants={addedParticipants}
                  companies={companies}                  
                />
              )}
              <div className="mt-4">
                <ul className="list-disc pl-5 flex flex-col gap-y-2">
                  {selectedParticipants.map((participant) => (
                    <li key={participant}>
                      {participant}
                      <button
                        className="bg-red-500 text-white p-2 rounded-lg w-fit hover:text-black ml-4"
                        onClick={() => handleRemoveParticipant(participant)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-x-3">
                <button
                  className="border border-blue-500  text-blue-500 px-4 py-2 rounded"
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  Cancel
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
