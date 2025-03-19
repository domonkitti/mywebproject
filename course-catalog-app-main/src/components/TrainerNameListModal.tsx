import React, { useState } from 'react'

type TrainerNameListModalProps = {
  names: string[]
  onClose: () => void
  onAdd: (name: string) => void
  addedTrainers: string[]
}

const TrainerNameListModal: React.FC<TrainerNameListModalProps> = ({
  names,
  onClose,
  onAdd,
  addedTrainers
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNames = names.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white p-4 rounded-lg shadow-md w-1/3">
        <h2 className="text-lg font-semibold mb-4">Trainer Names List</h2>
        <input
          type="search"
          placeholder="search"
          className="border rounded-lg w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ul className="flex flex-col max-h-[50vh] overflow-y-auto">
          {filteredNames.map((name) => (
            <li key={name} className="flex justify-between items-center mb-2">
              <span>{name}</span>
              <button
                className={`px-2 py-1 rounded ${addedTrainers.includes(name) ? 'bg-gray-300' : 'text-blue-500 hover:text-blue-700'}`}
                onClick={() => onAdd(name)}
                disabled={addedTrainers.includes(name)}
                name={`button-${name}`}
              >
                {addedTrainers.includes(name) ? 'Added' : 'Add'}
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

export default TrainerNameListModal
