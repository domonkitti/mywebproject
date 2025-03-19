import { useEffect, useState, useMemo } from 'react'
import {  getClasss } from '../apis/AllClass'
import ClassTable from '../components/ClassTable'
import { ClassForFrontEnd } from '../interfaces/MainInterface';
import calculateClassStatus from '../utils/CalculateStatus';


const ClassPage = () => {
  const [classes, setClasses] = useState<ClassForFrontEnd[]>([]);

  useEffect(() => {
    getClasss().then((data) => {
      const processedData = data.map((classItem: ClassForFrontEnd) => ({
        ...classItem,
        startDate: new Date(classItem.startDate),
        endDate: new Date(classItem.endDate),
      }));
      setClasses(processedData);
    });
  }, []);

  const processedClasses = useMemo(() => {
    const today = new Date();
  
    // เพิ่ม status และจัดเรียงข้อมูล
    const sortedClasses = classes
      .map((classItem) => {
        const status = calculateClassStatus({
          startDate: classItem.startDate,
          endDate: classItem.endDate,
          today,
        });
        return { ...classItem, status };
      })
      .sort((a, b) => {
        if (a.status === "Upcoming") return -1;
        if (b.status === "Upcoming") return 1;
        if (a.status === "Ongoing") return -1;
        if (b.status === "Ongoing") return 1;
        return 0;
      });
  
    return sortedClasses;
  }, [classes]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-10">Class Page</h1>
      <ClassTable classes={processedClasses} />
    </div>
  );
};

export default ClassPage;
