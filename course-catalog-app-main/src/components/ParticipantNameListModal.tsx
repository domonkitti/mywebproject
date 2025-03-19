import React, { useState } from 'react'
import AddNewParticipant from './AddNewParticipant'
import { Company } from '../interfaces/MainInterface'

type ParticipantNameListModalProps = {
  names: string[]
  onClose: () => void
  onAdd: (name: string) => void
  addedParticipants: string[] // List of Participants that have been added
  companies: Company[]
}

const ParticipantNameListModal: React.FC<ParticipantNameListModalProps> = ({
  names,
  onClose,
  onAdd,
  addedParticipants,
  companies
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showParentModal, setShowParentModal] = useState<boolean>(false)

  // Filter names based on the search query
  const filteredNames = names.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.localeCompare(b))

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-md w-1/3 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Participant Names List</h2>

        <input
          type="search"
          placeholder="search"
          className="border rounded-lg w-full mb-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mb-2"
          onClick={(e) => {
            e.preventDefault()
            setShowParentModal(true)
          }}
        >
          เพิ่มผู้เรียนใหม่
        </button>

        <AddNewParticipant
          companies={companies}
          show={showParentModal}
          onClose={() => setShowParentModal(false)}
        />

        <ul className="overflow-y-auto max-h-60">
          {filteredNames.map((name) => (
            <li key={name} className="flex justify-between items-center mb-2">
              <span>{name}</span>
              <button
                className={`px-2 py-1 rounded ${
                  addedParticipants.includes(name)
                    ? 'bg-gray-300'
                    : 'text-blue-500 hover:text-blue-700'
                }`}
                onClick={() => onAdd(name)}
                disabled={addedParticipants.includes(name)}
                name={`button-${name}`}
              >
                {addedParticipants.includes(name) ? 'Added' : 'Add'}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded"
          onClick={onClose}
        >
          Close Modal
        </button>
      </div>
    </div>
  )
}

export default ParticipantNameListModal