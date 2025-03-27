import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoPencil } from "react-icons/io5";

// 🔧 สมมุติว่าเราจะใช้ API จริงทีหลัง เช่น getProjectById(projectId)
// const getProjectById = async (id: string) => { ... }

const getMockProjectById = async (id: string) => {
  return {
    projectId: id,
    projectName: "โครงการ A",
    departmentName: "ฝ่าย A",
    subProjects: [
      {
        subProjectId: 11,
        subProjectName: "งานย่อย A-1",
        budgetPlan: [
          {
            year: 2024,
            budgetAllocated: {
              ผูกพัน: { เงินกู้: 100000, เงินรายได้: 50000 },
              ลงทุน: { เงินกู้: 200000, เงินรายได้: 100000 },
            },
            budgetUsage: {
              ผูกพัน: { เงินกู้: 50000, เงินรายได้: 25000 },
              ลงทุน: { เงินกู้: 150000, เงินรายได้: 75000 },
            },
          },
        ],
      },
      {
        subProjectId: 12,
        subProjectName: "งานย่อย A-2",
        budgetPlan: [
          {
            year: 2024,
            budgetAllocated: {
              ผูกพัน: { เงินกู้: 60000, เงินรายได้: 30000 },
              ลงทุน: { เงินกู้: 100000, เงินรายได้: 50000 },
            },
            budgetUsage: {
              ผูกพัน: { เงินกู้: 30000, เงินรายได้: 15000 },
              ลงทุน: { เงินกู้: 80000, เงินรายได้: 30000 },
            },
          },
        ],
      },
    ],
  };
};

const formatNumber = (num: number) =>
  isNaN(num) ? "-" : num.toLocaleString("th-TH", { minimumFractionDigits: 0 });

const ConfirmApprovePage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);

  useEffect(() => {
    if (!projectId) return;
    getMockProjectById(projectId).then((data) => {
      setProject(data);
      const years = data.subProjects.flatMap((sp) => sp.budgetPlan.map((bp) => bp.year));
      setUniqueYears(Array.from(new Set(years)).sort((a, b) => a - b));
    });
  }, [projectId]);

  if (!project) return <p className="text-center">กำลังโหลด...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">รายละเอียดโครงการ: {project.projectName}</h2>
      <div className="overflow-auto">
        <table className="w-full text-sm border border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="border p-2" rowSpan={2}>ชื่อโครงการ</th>
              <th className="border p-2" rowSpan={2}>งานย่อย</th>
              {uniqueYears.map((year) => (
                <React.Fragment key={`year-${year}`}>
                  <th className="border p-2" colSpan={3}>งบประมาณปี {year}</th>
                  <th className="border p-2" colSpan={3}>เบิกจ่ายปี {year}</th>
                  <th className="border p-2">คงเหลือ</th>
                  <th className="border p-2">ตัดทิ้ง</th>
                </React.Fragment>
              ))}
            </tr>
            <tr>
              {uniqueYears.map((year) => (
                <React.Fragment key={`subhead-${year}`}>
                  <th className="border p-2">ผูกพัน</th>
                  <th className="border p-2">ลงทุน</th>
                  <th className="border p-2">รวม</th>
                  <th className="border p-2">ผูกพัน</th>
                  <th className="border p-2">ลงทุน</th>
                  <th className="border p-2">รวม</th>
                  <th className="border p-2"></th>
                  <th className="border p-2"></th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {project.subProjects.map((sp, spIndex) => (
              <tr key={sp.subProjectId}>
                {spIndex === 0 && (
                  <td
                    className="border p-2 font-bold text-left"
                    rowSpan={project.subProjects.length + 2}
                  >
                    <button
                      onClick={() => console.log("Edit", project)}
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
                      <IoPencil size={18} />
                    </button>
                    {project.projectName}
                  </td>
                )}
                <td className="border p-2 text-left">{sp.subProjectName}</td>
                {uniqueYears.map((year) => {
                  const bp = sp.budgetPlan.find((bp) => bp.year === year);
                  if (!bp) {
                    return Array(8)
                      .fill(null)
                      .map((_, i) => <td key={`empty-${year}-${i}`} className="border p-2"></td>);
                  }

                  const b = bp.budgetAllocated;
                  const u = bp.budgetUsage;
                  const sum = (obj) =>
                    obj.ผูกพัน.เงินกู้ +
                    obj.ผูกพัน.เงินรายได้ +
                    obj.ลงทุน.เงินกู้ +
                    obj.ลงทุน.เงินรายได้;
                  const remaining = sum(b) - sum(u);

                  return (
                    <React.Fragment key={`data-${year}`}>
                      <td className="border p-2 text-right">{formatNumber(b.ผูกพัน.เงินกู้ + b.ผูกพัน.เงินรายได้)}</td>
                      <td className="border p-2 text-right">{formatNumber(b.ลงทุน.เงินกู้ + b.ลงทุน.เงินรายได้)}</td>
                      <td className="border p-2 text-right font-bold">{formatNumber(sum(b))}</td>
                      <td className="border p-2 text-right">{formatNumber(u.ผูกพัน.เงินกู้ + u.ผูกพัน.เงินรายได้)}</td>
                      <td className="border p-2 text-right">{formatNumber(u.ลงทุน.เงินกู้ + u.ลงทุน.เงินรายได้)}</td>
                      <td className="border p-2 text-right font-bold">{formatNumber(sum(u))}</td>
                      <td className="border p-2 text-right">{formatNumber(remaining)}</td>
                      <td className="border p-2"></td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}

            {/* ✅ แถว: เงินกู้ */}
            <tr>
              <td className="border p-2 text-left font-bold" colSpan={1}>เงินกู้</td>
              {uniqueYears.map((year) => (
                <React.Fragment key={`loan-input-${year}`}>
                  {Array(6).fill(null).map((_, i) => (
                    <td key={`loan-cell-${year}-${i}`} className="border p-2">
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full text-right border px-1"
                      />
                    </td>
                  ))}
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                </React.Fragment>
              ))}
            </tr>

            {/* ✅ แถว: เงินรายได้ */}
            <tr>
              <td className="border p-2 text-left font-bold" colSpan={1}>เงินรายได้</td>
              {uniqueYears.map((year) => (
                <React.Fragment key={`rev-input-${year}`}>
                  {Array(6).fill(null).map((_, i) => (
                    <td key={`rev-cell-${year}-${i}`} className="border p-2">
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full text-right border px-1"
                      />
                    </td>
                  ))}
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                </React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfirmApprovePage;
