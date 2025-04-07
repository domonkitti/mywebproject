import { useEffect, useState } from "react";
import { getProjectRequests } from "../../apis/UserProjectApi";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const formatDate = (date: Date | string) => dayjs(date).format("DD/MM/YYYY");

interface ProjectResponse {
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

const ReviewingProjectPage = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);

  useEffect(() => {
    getProjectRequests().then((response) => {
      // ✅ response.data เพราะ JSON ของคุณอยู่ใน data
      const data = response.data || [];
      const formatted = data.map((p: ProjectResponse) => ({
        ...p,
        start_date: new Date(p.start_date),
        end_date: new Date(p.end_date),
      }));
      setProjects(formatted);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">โครงการที่กำลังพิจารณา</h1>
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-center">ชื่อโครงการ</th>
              <th className="border px-4 py-2 text-center">ประเภทงาน</th>
              <th className="border px-4 py-2 text-center">หมวดหมู่</th>
              <th className="border px-4 py-2 text-center">เจ้าของโครงการ</th>
              <th className="border px-4 py-2 text-center">วันที่เริ่มต้น</th>
              <th className="border px-4 py-2 text-center">วันที่สิ้นสุด</th>
              <th className="border px-4 py-2 text-center">งบประมาณ</th>
              <th className="border px-4 py-2 text-center">สถานะ</th>
              <th className="border px-4 py-2 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.project_id} className="text-center">
                <td className="border px-4 py-2">{project.project_name}</td>
                <td className="border px-4 py-2">{project.type || "-"}</td>
                <td className="border px-4 py-2">{project.subtype || "-"}</td>
                <td className="border px-4 py-2">{project.owner || "-"}</td>
                <td className="border px-4 py-2">{formatDate(project.start_date)}</td>
                <td className="border px-4 py-2">{formatDate(project.end_date)}</td>
                <td className="border px-4 py-2">{project.budget?.toLocaleString() || "-"} บาท</td>
                <td className="border px-4 py-2 font-bold">{project.status}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/ConfirmApprove/${project.project_id}`}
                    className="bg-green-200 p-2 rounded-full text-green-600 hover:bg-green-300"
                  >
                    ✅ Approve
                  </Link>
                  <Link
                    to={`/RejectProject/${project.project_id}`}
                    className="bg-red-200 p-2 rounded-full text-red-600 hover:bg-red-300 ml-2"
                  >
                    ❌ Reject
                  </Link>
                  <button className="bg-green-200 ml-2 px-2 py-2 rounded hover:bg-green-300 rounded-full">
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewingProjectPage;
