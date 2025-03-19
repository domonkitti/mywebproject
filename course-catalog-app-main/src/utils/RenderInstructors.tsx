/**
 * Function to render instructor names with a limit of 3
 * @param instructors - Array of instructor names
 */
const renderInstructors = (instructors: string[]) => {
  const MAX_DISPLAY_COUNT = 3;
  return (
    <>
      {instructors.slice(0, MAX_DISPLAY_COUNT).map((name, index) => (
        <div key={index}>{name}</div>
      ))}
      {instructors.length > MAX_DISPLAY_COUNT && (
        <div>+{instructors.length - MAX_DISPLAY_COUNT}</div>
      )}
    </>
  );
};

export default renderInstructors;
