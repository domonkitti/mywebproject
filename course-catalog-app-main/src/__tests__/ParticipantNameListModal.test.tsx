import { describe, it, vi, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ParticipantNameListModal from '../components/ParticipantNameListModal'
import '@testing-library/jest-dom'

describe('ParticipantNameListModal', () => {
  const mockNames = ['John Doe admin@pea.co.th', 'Jane Smith admin2@pea.co.th', 'Bob Johnson user1@pea.co.th']
  const mockCompanies = [
    {
      companyId: 1,
      codeName: 'COMP_A',
      fullName: 'Company A'
    },
    {
      companyId: 2,
      codeName: 'COMP_B',
      fullName: 'Company B'
    }
  ]
  const mockOnClose = vi.fn()
  const mockOnAdd = vi.fn()

  const defaultProps = {
    names: mockNames,
    onClose: mockOnClose,
    onAdd: mockOnAdd,
    addedParticipants: [],
    companies: mockCompanies
  }

  it('renders modal with correct title', () => {
    render(<ParticipantNameListModal {...defaultProps} />)
    expect(screen.getByText('Participant Names List')).toBeInTheDocument()
  })

  it('renders all names in the list', () => {
    render(<ParticipantNameListModal {...defaultProps} />)
    mockNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })

  

  it('disables Add button and shows Added text for already added participants', () => {
    render(
      <ParticipantNameListModal
        {...defaultProps}
        addedParticipants={['John Doe admin@pea.co.th']}
      />
    )

    const addedButton = screen.getByRole('button', { name: 'Added' })
    expect(addedButton).toBeDisabled()
    expect(addedButton).toHaveClass('bg-gray-300')
    expect(addedButton).toHaveAttribute('name', 'button-John Doe admin@pea.co.th')
  })

  it('calls onClose when Close Modal button is clicked', async () => {
    render(<ParticipantNameListModal {...defaultProps} />)

    const closeButton = screen.getByText('Close Modal')
    await userEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('opens AddNewParticipant modal when Open Parent Modal button is clicked', async () => {
    render(<ParticipantNameListModal {...defaultProps} />)

    const openParentButton = screen.getByText('เพิ่มผู้เรียนใหม่')
    await userEvent.click(openParentButton)

    expect(openParentButton).toBeInTheDocument()
  })

  it('handles case-insensitive search', async () => {
    render(<ParticipantNameListModal {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText('search')
    await userEvent.type(searchInput, 'john')

    expect(screen.getByText('John Doe admin@pea.co.th')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith admin2@pea.co.th')).not.toBeInTheDocument()
  })
})
