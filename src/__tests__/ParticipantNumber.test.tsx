import '@testing-library/jest-dom'
import { describe, it } from 'vitest'
import ParticipantNumber from '../components/ParticipantNumber'

describe('number of participant not 20 seats', () => {
  it('renders correctly when number of participants is below or equal to 20', () => {
    let participantNumber = 15
    const result = ParticipantNumber(participantNumber)
    expect(result).toEqual(
      <h3 className="text-lg font-semibold">
        Participants{' '}
        <span className="text-black-500">({participantNumber}/20)</span>
      </h3>
    )
  })

  it('renders correctly when number of participants exceeds 20', () => {
    let participantNumber = 21

    const result = ParticipantNumber(participantNumber)
    expect(result).toEqual(
      <h3 className="text-lg font-semibold">
        Participants{' '}
        <span className="text-red-500">({participantNumber}/20)</span>
      </h3>
    )
  })
})
