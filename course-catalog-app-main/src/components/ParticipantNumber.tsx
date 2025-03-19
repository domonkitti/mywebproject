export default function ParticipantNumber(numberParticipant: number) {
  if (numberParticipant > 20) {
    return (
      <h3 className="text-lg font-semibold">
        Participants{' '}
        <span className="text-red-500">({numberParticipant}/20)</span>
      </h3>
    )
  } else {
    return (
      <h3 className="text-lg font-semibold">
        Participants{' '}
        <span className="text-black-500">({numberParticipant}/20)</span>
      </h3>
    )
  }
}
