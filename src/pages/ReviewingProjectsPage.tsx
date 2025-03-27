import { useEffect, useState } from "react";
import { approveProject, rejectProject, getProjectRequests } from "../apis/ProjectApi";
import { ProjectForFrontEnd } from "../interfaces/MainInterface";
import ConfirmApprove from "../components/AdminEdit/ConfirmApprove";
import dayjs from "dayjs";

const formatDate = (date: Date | string) => dayjs(date).format("DD/MM/YYYY");

const ReviewingProjectPage = () => {
  const [projects, setProjects] = useState<ProjectForFrontEnd[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectForFrontEnd | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getProjectRequests().then((data) => {
      const filtered = data
        .filter((p) => p.status === "กำลังพิจารณา")
        .map((p) => ({ ...p, startDate: new Date(p.startDate), endDate: new Date(p.endDate) }));
      setProjects(filtered);
    });
  }, []);

  const handleApprove = async (project: ProjectForFrontEnd) => {
    await approveProject(project);
    setProjects((prev) => prev.filter((p) => p.projectId !== project.projectId));
    closeModal();
  };

  const handleReject = async (projectId: string) => {
    await rejectProject(projectId);
    setProjects((prev) => prev.filter((p) => p.projectId !== projectId));
    closeModal();
  };

  const openModal = (project: ProjectForFrontEnd) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">โครงการที่กำลังพิจารณา</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-center">ชื่อโครงการ</th>
            <th className="border px-4 py-2 text-center">หน่วยงาน</th>
            <th className="border px-4 py-2 text-center">วันที่เริ่มต้น</th>
            <th className="border px-4 py-2 text-center">วันที่สิ้นสุด</th>
            <th className="border px-4 py-2 text-center">งบประมาณ</th>
            <th className="border px-4 py-2 text-center">สถานะ</th>
            <th className="border px-4 py-2 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.projectId} className="text-center">
              <td className="border px-4 py-2">{project.projectName}</td>
              <td className="border px-4 py-2">{project.departmentName}</td>
              <td className="border px-4 py-2">{formatDate(project.startDate)}</td>
              <td className="border px-4 py-2">{formatDate(project.endDate)}</td>
              <td className="border px-4 py-2">{project.budgetTotal?.toLocaleString()} บาท</td>
              <td className="border px-4 py-2 font-bold">{project.status}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => openModal(project)}
                >
                  ✅ Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Modal แสดงเมื่อเปิดเท่านั้น */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ConfirmApprove
            isOpen={isModalOpen}
            project={selectedProject}
            onClose={closeModal}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewingProjectPage;
