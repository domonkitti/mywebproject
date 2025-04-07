import { IoPencil, IoTrash } from "react-icons/io5";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

interface ProjectTableProps {
  projects: {
    project_id: number;
    project_name: string;
    status: string;
    start_date: string;
    end_date: string;
    type: string;
    subtype: string;
    owner: string;
    budget: number;
  }[];
}

const formatDate = (date: Date | string) => {
  return dayjs(date).format("DD/MM/YYYY");
};

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-400">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="text-center border border-gray-400 px-4 py-2">ชื่อโครงการ</th>
            <th className="text-center border border-gray-400 px-4 py-2">หน่วยงาน</th>
            <th className="text-center border border-gray-400 px-4 py-2">วันที่เริ่มต้น</th>
            <th className="text-center border border-gray-400 px-4 py-2">วันที่สิ้นสุด</th>
            <th className="text-center border border-gray-400 px-4 py-2">งบประมาณ</th>
            <th className="text-center border border-gray-400 px-4 py-2">สถานะ</th>
            <th className="text-center border border-gray-400 px-4 py-2">แก้ไข</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.project_id} className="hover:bg-gray-50">
              <td className="text-left border border-gray-400 px-4 py-2">{project.project_name}</td>
              <td className="text-left border border-gray-400 px-4 py-2">{project.owner}</td>
              <td className="text-center border border-gray-400 px-4 py-2">{formatDate(project.start_date)}</td>
              <td className="text-center border border-gray-400 px-4 py-2">{formatDate(project.end_date)}</td>
              <td className="text-center border border-gray-400 px-4 py-2">
                {(project.budget ?? 0).toLocaleString()} บาท
              </td>
              <td className="text-center border border-gray-400 px-4 py-2 font-bold">{project.status}</td>
              <td className="text-right border border-gray-400 px-4 py-2">
                <div className="flex flex-row justify-center space-x-3">
                  <Link
                    to={`/editproject/${project.project_id}`}
                    className="bg-green-200 p-2 rounded-full text-green-600 hover:bg-green-300"
                  >
                    <IoPencil className="h-5 w-5" />
                  </Link>
                  <button className="bg-red-200 p-2 rounded-full text-red-600 hover:bg-red-300">
                    <IoTrash className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
