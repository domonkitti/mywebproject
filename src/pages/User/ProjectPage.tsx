import { useEffect, useState } from "react";
import ProjectTable from "../../components/ProjectTable";
import { getProjectRequests } from "../../apis/UserProjectApi";

interface ProjectFromApi {
  project_id: number;
  project_name: string;
  status: string;
  start_date: string;
  end_date: string;
  type: string;
  subtype: string;
  owner: string;
  budget: number;
}

const ProjectPage = () => {
  const [projects, setProjects] = useState<ProjectFromApi[]>([]);

  useEffect(() => {
    getProjectRequests().then((response) => {
      const data = response.data; // สมมติ response = { data: [...] }
      setProjects(data);
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
