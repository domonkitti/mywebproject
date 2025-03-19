import { useState, useEffect } from 'react'
import { Participant } from '../interfaces/MainInterface'

type Props = {
  participant: Participant[]
  onCheckedEmailsChange: (checkedEmails: string[]) => void
}

export default function ParticipantList({
  participant,
  onCheckedEmailsChange
}: Props) {
  const initialEmails = participant
    .map((p) => ({ ...p, isChecked: false }))
    .sort((a, b) => Number(a.isEmailSend) - Number(b.isEmailSend))

  const [emails, setEmails] = useState(initialEmails)
  const [isAllChecked, setIsAllChecked] = useState(false)

  const handleCheckAll = () => {
    const newIsAllChecked = !isAllChecked
    setIsAllChecked(newIsAllChecked)
    setEmails(
      emails.map((item) => ({
        ...item,
        isChecked: !item.isEmailSend && newIsAllChecked
      }))
    )
  }

  const handleCheckItem = (index: number) => {
    const updatedEmails = [...emails]
    const item = updatedEmails[index]
    if (!item.isEmailSend) {
      item.isChecked = !item.isChecked
      setEmails(updatedEmails)
      setIsAllChecked(
        updatedEmails.every((item) => item.isChecked || item.isEmailSend)
      )
    }
  }

  const getCheckedEmails = () =>
    emails.filter((email) => email.isChecked).map((email) => email.email)

  useEffect(() => {
    onCheckedEmailsChange(getCheckedEmails())
  }, [emails])

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-[24px]">Send to</h2>
      <div className="container w-[250px] h-[64vh] mt-[20px] p-[8px] rounded-[8px] shadow-xl overflow-auto">
        <div className="flex justify-between items-center p-[8px]">
          <p className="font-bold text-[16px]">Participant</p>
          {emails.length > 0 && (
            <input
              checked={isAllChecked}
              onChange={handleCheckAll}
              id="checked-checkbox"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              data-testid="checkbox-all"
            />
          )}
        </div>
        <div className="flex flex-col h-full gap-[8px]">
          {emails.length > 0 ? (
            emails.map((item, index) => (
              <div
                key={item.email}
                className="flex justify-start items-center gap-[10px] p-[10px] shadow-lg rounded-[8px]"
              >
                {!item.isEmailSend && (
                  <input
                    checked={item.isChecked}
                    onChange={() => handleCheckItem(index)}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    data-testid={`checkbox-${item.email}`}
                  />
                )}
                <p>{item.email}</p>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              No Participants!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
