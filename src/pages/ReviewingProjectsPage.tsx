import { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { approveProject, rejectProject, getProjectRequests } from "../apis/ProjectApi";
import { ProjectForFrontEnd } from "../interfaces/MainInterface";
import dayjs from "dayjs";

// ✅ แปลงวันที่ให้อยู่ในรูปแบบ DD/MM/YYYY
const formatDate = (date: Date | string) => dayjs(date).format("DD/MM/YYYY");

const ReviewingProjectPage = () => {
  const [projects, setProjects] = useState<ProjectForFrontEnd[]>([]);

  useEffect(() => {
    getProjectRequests().then((data) => {
      // ✅ กรองเฉพาะโครงการที่มีสถานะ "กำลังพิจารณา"
      const filteredData = data
        .filter((project: ProjectForFrontEnd) => project.status === "กำลังพิจารณา")
        .map((projectItem: ProjectForFrontEnd) => ({
          ...projectItem,
          startDate: new Date(projectItem.startDate),
          endDate: new Date(projectItem.endDate),
        }));

      setProjects(filteredData);
    });
  }, []);

  // ✅ กด Approve → เปลี่ยนสถานะเป็น "รอดำเนินการ"
  const handleApprove = async (project: ProjectForFrontEnd) => {
    await approveProject(project);
    setProjects((prev) => prev.filter((p) => p.projectId !== project.projectId));
  };

  // ✅ กด Reject → เปลี่ยนสถานะเป็น "ปฏิเสธ"
  const handleReject = async (projectId: string) => {
    await rejectProject(projectId);
    setProjects((prev) => prev.filter((p) => p.projectId !== projectId));
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
            <Table.Row key={project.projectId} className="border border-gray-400">
              <Table.Cell className="text-left border border-gray-400 px-4">{project.projectName}</Table.Cell>
              <Table.Cell className="text-left border border-gray-400 px-4">{project.departmentName}</Table.Cell>
              <Table.Cell className="text-center border border-gray-400 px-4">{formatDate(project.startDate)}</Table.Cell>
              <Table.Cell className="text-center border border-gray-400 px-4">{formatDate(project.endDate)}</Table.Cell>
              <Table.Cell className="text-center border border-gray-400 px-4">
                {(project.budgetTotal ?? 0).toLocaleString()} บาท
              </Table.Cell>
              <Table.Cell className="text-center border border-gray-400 px-4 font-bold">{project.status}</Table.Cell>
              <Table.Cell className="text-right border border-gray-400 px-4">
                <div className="flex flex-row justify-center space-x-3">
                  <button
                    className="bg-blue-200 p-2 rounded-full text-blue-600 hover:bg-blue-300"
                    onClick={() => handleApprove(project)}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="bg-red-200 p-2 rounded-full text-red-600 hover:bg-red-300"
                    onClick={() => handleReject(project.projectId)}
                  >
                    ❌ Reject
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ReviewingProjectPage;
