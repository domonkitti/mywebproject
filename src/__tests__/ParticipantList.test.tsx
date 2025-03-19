import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, vi } from 'vitest'
import ParticipantList from '../components/ParticipantList'
import { Participant } from '../interfaces/MainInterface'

describe('ParticipantList component', () => {
  const mockParticipants: Participant[] = [
    {
      firstNameTh: "เทส1",
      lastNameTh: "เทส1",
      firstNameEn: "test1",
      lastNameEn: "test1",
      email: "test1@test.com",
      companyId: 1,
      isEmailSend: false
    },
    {
      firstNameTh: "เทส2",
      lastNameTh: "เทส2",
      firstNameEn: "test2",
      lastNameEn: "test2",
      email: "test2@test.com",
      companyId: 1,
      isEmailSend: false
    }
  ]
  const mockEmailChecked = vi.fn()

  it('should render participants', async () => {
    render(
      <ParticipantList
        participant={mockParticipants}
        onCheckedEmailsChange={mockEmailChecked}
      />
    )

    expect(await screen.getByText("test1@test.com")).toBeInTheDocument()
    expect(await screen.getByText("test2@test.com")).toBeInTheDocument()
  })

  it('should return selected email', async () => {
    render(
      <ParticipantList
        participant={mockParticipants}
        onCheckedEmailsChange={mockEmailChecked}
      />
    )

    const checkBoxAll = await screen.getByTestId('checkbox-all')
    fireEvent.click(checkBoxAll)
    
    await waitFor(() => [
      expect(mockEmailChecked).toHaveBeenCalledWith([
        "test1@test.com",
        "test2@test.com",
      ])
    ])
  })
})