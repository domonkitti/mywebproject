import { useEffect, useState } from "react";
import ProjectTable from "../components/ProjectTable";
import { getProjectRequests } from "../apis/ProjectApi";
import { ProjectForFrontEnd } from "../interfaces/MainInterface";

const ProjectPage = () => {
  const [projects, setProjects] = useState<ProjectForFrontEnd[]>([]);

  useEffect(() => {
    getProjectRequests().then((data) => {
      const processedData = data.map((projectItem: ProjectForFrontEnd) => ({
        ...projectItem,
        startDate: new Date(projectItem.startDate), // แปลง string เป็น Date
        endDate: new Date(projectItem.endDate),
      }));
      setProjects(processedData);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-10">หน้าโครงการที่ขอตั้ง</h1>
      <ProjectTable projects={projects} />
    </div>
  );
};

export default ProjectPage;
