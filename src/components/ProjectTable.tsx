import { Table } from "flowbite-react";
import { ProjectForFrontEnd } from "../interfaces/MainInterface";
import { IoPencil, IoTrash } from "react-icons/io5";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

interface ProjectTableProps {
  projects: ProjectForFrontEnd[];
}

const formatDate = (date: Date | string) => {
  return dayjs(date).format("DD/MM/YYYY");
};

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  return (
    <div className="overflow-x-auto">
      <Table striped>
        {/* ✅ หัวตาราง (thead) อยู่ตรงกลาง */}
        <Table.Head className="bg-gray-100 text-gray-700">
          <Table.HeadCell className="text-center">ชื่อโครงการ</Table.HeadCell>
          <Table.HeadCell className="text-center">หน่วยงาน</Table.HeadCell>
          <Table.HeadCell className="text-center">วันที่เริ่มต้น</Table.HeadCell>
          <Table.HeadCell className="text-center">วันที่สิ้นสุด</Table.HeadCell>
          <Table.HeadCell className="text-center">งบประมาณ</Table.HeadCell>
          <Table.HeadCell className="text-center">สถานะ</Table.HeadCell>
          <Table.HeadCell className="text-center">แก้ไข</Table.HeadCell>
        </Table.Head>
        
        {/* ✅ ข้อมูลใน tbody อยู่ชิดขวา และมีเส้นตาราง */}
        <Table.Body className="divide-y border border-gray-400">
          {projects.map((project) => (
            <Table.Row key={project.projectId} className="border border-gray-400">
              <Table.Cell className="text-left border border-gray-400 px-4">
                {project.projectName}
              </Table.Cell>
              <Table.Cell className="text-left border border-gray-400 px-4">
                {project.departmentName}
              </Table.Cell>
              <Table.Cell className="text-center border border-gray-400 px-4">
                {formatDate(project.startDate)}
              </Table.Cell>
              <Table.Cell className="text-center border border-gray-400 px-4">
                {formatDate(project.endDate)}
              </Table.Cell>
              <Table.Cell className="text-center border border-gray-400 px-4">
                {(project.budgetTotal ?? 0).toLocaleString()} บาท
              </Table.Cell>
              <Table.Cell className="text-center border border-gray-400 px-4 font-bold">
                {project.status}
              </Table.Cell>
              <Table.Cell className="text-right border border-gray-400 px-4">
                <div className="flex flex-row justify-center space-x-3">
                  <Link
                    to={`/editproject/${project.projectId}`}
                    className="bg-green-200 p-2 rounded-full text-green-600 hover:bg-green-300">
                    <IoPencil className="h-5 w-5" />
                  </Link>
                  <button className="bg-red-200 p-2 rounded-full text-red-600 hover:bg-red-300">
                    <IoTrash className="h-5 w-5" />
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

export default ProjectTable;
