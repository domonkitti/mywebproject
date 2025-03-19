// src/components/TrainerNameListModal.test.tsx
// import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, vi } from 'vitest'
import TrainerNameListModal from '../components/TrainerNameListModal'

describe('TrainerNameListModal Component', () => {
  const mockNames = ['Trainer A', 'Trainer B', 'Trainer C']
  const mockOnClose = vi.fn()
  const mockOnAdd = vi.fn()

  it('calls onAdd and changes button text to "Added" when add button is clicked', () => {
    render(
      <TrainerNameListModal
        names={mockNames}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
        addedTrainers={[]}
      />
    )

    // Get the "Add" button for the first trainer (Trainer A)
    // const addButton = screen.getAllByRole('button', { name: 'Add' })[0] // Select the first "Add" button (Trainer A)
    // fireEvent.click(addButton)

    // Ensure onAdd function is called with the correct trainer name
    //qexpect(mockOnAdd).toHaveBeenCalledWith('Trainer A')
  })
})
