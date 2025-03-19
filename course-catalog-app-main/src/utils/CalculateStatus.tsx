interface CalculateClassStatusProps {
    startDate: Date;
    endDate: Date;
    today: Date;
  }
  
  const calculateClassStatus = ({ startDate, endDate,today }: CalculateClassStatusProps,
  ) => {
    if (startDate > today) {
      return "Upcoming";
    } else if (startDate <= today && endDate >= today) {
      return "Ongoing";
    } else {
      return "Done";
    }
  };
  
  export default calculateClassStatus;
  