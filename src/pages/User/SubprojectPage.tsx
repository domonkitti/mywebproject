import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Subproject from "../../components/EditForm/Subproject";
import BudgetSummaryTable from "../../components/EditForm/BudgetSummaryTable";

interface SubProject {
  id: number;
  name: string;
  totalBudget: number;
}

// --- API ---
const getSubTasks = async (projectId: number): Promise<SubProject[]> => {
  const response = await fetch(`http://localhost:2024/projects/subtasks/${projectId}`);
  const data = await response.json();
  return Array.isArray(data.data)
    ? data.data.map((sp: any) => ({
        id: sp.draft_id,
        name: sp.subtask_name,
        totalBudget: sp.total_funding,
      }))
    : [];
};

const createSubTask = async (
  projectId: number,
  name: string,
  totalBudget: number
): Promise<SubProject> => {
  const response = await fetch(`http://localhost:2024/projects/subtasks/addsubtask/${projectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subtask_name: name,
      total_funding: totalBudget,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "เกิดข้อผิดพลาดในการสร้างงานย่อย");
  }

  const responseData = await response.json();
  const data = responseData.data;

  return {
    id: data.draft_id,
    name: data.subtask_name,
    totalBudget: data.total_funding,
  };
};

const deleteSubTask = async (projectId: number, draftId: number) => {
  const response = await fetch(
    `http://localhost:2024/projects/subtasks/deletesubtask/${projectId}?draftId=${draftId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "เกิดข้อผิดพลาดในการลบงานย่อย");
  }

  return await response.json();
};

// --- Page Component ---
const SubprojectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const projectIdNumber = Number(projectId);

  const [subProjects, setSubProjects] = useState<SubProject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectIdNumber) return;
    setLoading(true);
    getSubTasks(projectIdNumber)
      .then(setSubProjects)
      .catch((error) => {
        console.error("Error loading subtasks:", error);
      })
      .finally(() => setLoading(false));
  }, [projectIdNumber]);

  const handleAddSubProject = async (name: string, totalBudget: number) => {
    try {
      const newSubProject = await createSubTask(projectIdNumber, name, totalBudget);
      setSubProjects((prev) => [...prev, newSubProject]);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteSubProject = async (draftId: number) => {
    try {
      await deleteSubTask(projectIdNumber, draftId);
      setSubProjects((prev) => prev.filter((sp) => sp.id !== draftId));
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <Subproject
        loading={loading}
        subProjects={subProjects ?? []}
        onAddSubProject={handleAddSubProject}
        onDeleteSubProject={handleDeleteSubProject}
        projectId={projectIdNumber}
      />
      <BudgetSummaryTable projectId={projectIdNumber} />
    </div>
  );
};

export default SubprojectPage;
