import { useEffect, useState } from "react";
import { getProjectRequests } from "../../apis/ProjectApi";
import { ProjectForFrontEnd } from "../../interfaces/MainInterface";
import dayjs from "dayjs";
import { Link } from "react-router-dom"; // ✅ เพิ่ม import นี้เข้ามา

const formatDate = (date: Date | string) => dayjs(date).format("DD/MM/YYYY");

const ReviewingProjectPage = () => {
  const [projects, setProjects] = useState<ProjectForFrontEnd[]>([]);

  useEffect(() => {
    getProjectRequests().then((data) => {
      const filtered = data
        .filter((p) => p.status === "กำลังพิจารณา")
        .map((p) => ({ ...p, startDate: new Date(p.startDate), endDate: new Date(p.endDate) }));
      setProjects(filtered);
    });
  }, []);

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
                <Link
                  to={`/ConfirmApprove/${project.projectId}`}
                  className="bg-green-200 p-2 rounded-full text-green-600 hover:bg-green-300"
                >
                  ✅ Approve
                </Link>
                <Link
                  to={`/RejectProject/${project.projectId}`}
                  className="bg-red-200 p-2 rounded-full text-red-600 hover:bg-red-300 ml-2">
                  ❌ Reject
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewingProjectPage;
