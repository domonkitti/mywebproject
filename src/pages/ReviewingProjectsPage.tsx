import { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { approveProject, rejectProject, getProjectRequests } from "../apis/ProjectApi";
import { ProjectForFrontEnd } from "../interfaces/MainInterface";
import dayjs from "dayjs";
import ConfirmApprove from "../components/AdminEdit/ConfirmApprove";

const formatDate = (date: Date | string) => dayjs(date).format("DD/MM/YYYY");

const ReviewingProjectPage = () => {
  const [projects, setProjects] = useState<ProjectForFrontEnd[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectForFrontEnd | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getProjectRequests().then((data) => {
      const filteredData = data
        .filter((project: ProjectForFrontEnd) => project.status === "กำลังพิจารณา")
        .map((p) => ({
          ...p,
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
        }));
      setProjects(filteredData);
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
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold text-center mb-10">โครงการที่กำลังพิจารณา</h1>
      <Table striped>
        <Table.Head className="bg-gray-100 text-gray-700">
          <Table.HeadCell className="text-center">ชื่อโครงการ</Table.HeadCell>
          <Table.HeadCell className="text-center">หน่วยงาน</Table.HeadCell>
          <Table.HeadCell className="text-center">วันที่เริ่มต้น</Table.HeadCell>
          <Table.HeadCell className="text-center">วันที่สิ้นสุด</Table.HeadCell>
          <Table.HeadCell className="text-center">งบประมาณ</Table.HeadCell>
          <Table.HeadCell className="text-center">สถานะ</Table.HeadCell>
          <Table.HeadCell className="text-center">จัดการ</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y border border-gray-400">
          {projects.map((project) => (
            <Table.Row key={project.projectId}>
              <Table.Cell className="text-left border px-4">{project.projectName}</Table.Cell>
              <Table.Cell className="text-left border px-4">{project.departmentName}</Table.Cell>
              <Table.Cell className="text-center border px-4">{formatDate(project.startDate)}</Table.Cell>
              <Table.Cell className="text-center border px-4">{formatDate(project.endDate)}</Table.Cell>
              <Table.Cell className="text-center border px-4">{(project.budgetTotal ?? 0).toLocaleString()} บาท</Table.Cell>
              <Table.Cell className="text-center border px-4 font-bold">{project.status}</Table.Cell>
              <Table.Cell className="text-center border px-4">
                <button
                  className="bg-blue-200 p-2 rounded text-blue-700 hover:bg-blue-300"
                  onClick={() => openModal(project)}
                >
                  ✅ Approve
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {selectedProject && (
        <ConfirmApprove
          isOpen={isModalOpen}
          project={selectedProject}
          onClose={closeModal}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default ReviewingProjectPage;
