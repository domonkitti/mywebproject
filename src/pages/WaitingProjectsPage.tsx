import { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { getReviewedProjects } from "../apis/ProjectApi";
import { ProjectForFrontEnd } from "../interfaces/MainInterface";
import dayjs from "dayjs";

const formatDate = (date: Date | string) => dayjs(date).format("DD/MM/YYYY");

const WaitingProjectPage = () => {
  const [projects, setProjects] = useState<ProjectForFrontEnd[]>([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ Loading State

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true); // ✅ เริ่มโหลดข้อมูล
        const data = await getReviewedProjects();

        console.log("Raw API Response:", data); // ✅ Debug API Data

        const filteredData = data
          .filter((project: ProjectForFrontEnd) => project.status === "รอดำเนินการ")
          .map((projectItem: ProjectForFrontEnd) => ({
            ...projectItem,
            startDate: new Date(projectItem.startDate),
            endDate: new Date(projectItem.endDate),
          }));

        console.log("Filtered Projects:", filteredData); // ✅ Debug Processed Data

        setProjects([...filteredData]); // ✅ ใช้ spread operator เพื่อ force re-render
      } catch (error) {
        console.error("Error fetching projects:", error); // ✅ จับข้อผิดพลาด
      } finally {
        setIsLoading(false); // ✅ จบการโหลด
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold text-center mb-10">โครงการที่รอดำเนินการ</h1>

      {isLoading ? ( // ✅ แสดงข้อความ Loading
        <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : projects.length === 0 ? ( // ✅ ถ้าไม่มีโครงการแสดง "ไม่มีข้อมูล"
        <p className="text-center text-gray-500">ไม่มีโครงการที่รอดำเนินการ</p>
      ) : (
        <Table striped>
          <Table.Head className="bg-gray-100 text-gray-700">
            <Table.HeadCell className="text-center">ชื่อโครงการ</Table.HeadCell>
            <Table.HeadCell className="text-center">หน่วยงาน</Table.HeadCell>
            <Table.HeadCell className="text-center">วันที่เริ่มต้น</Table.HeadCell>
            <Table.HeadCell className="text-center">วันที่สิ้นสุด</Table.HeadCell>
            <Table.HeadCell className="text-center">งบประมาณ</Table.HeadCell>
            <Table.HeadCell className="text-center">สถานะ</Table.HeadCell>
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
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default WaitingProjectPage;
