import React, { useEffect, useState } from "react";
import { IoClose, IoPencil } from "react-icons/io5";

interface ConfirmApproveProps {
  isOpen: boolean;
  onClose: () => void;
}

const getReviewedProjects = async () => {
  return [
    {
      projectId: 1,
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
    },
  ];
};

const formatNumber = (num: number) =>
  isNaN(num) ? "-" : num.toLocaleString("th-TH", { minimumFractionDigits: 0 });

const ConfirmApprove = ({ isOpen, onClose }: ConfirmApproveProps) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);

  useEffect(() => {
    getReviewedProjects().then((data) => {
      setProjects(data);
      const years = data.flatMap((p) =>
        p.subProjects.flatMap((sp) => sp.budgetPlan.map((bp) => bp.year))
      );
      setUniqueYears(Array.from(new Set(years)).sort((a, b) => a - b));
    });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-6xl mx-auto rounded-lg shadow-lg p-6 relative overflow-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Confirm Approve</h2>

        <div className="overflow-auto">
          <table className="w-full text-sm border border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-center">
              <tr>
                <th className="border p-2" rowSpan={2}>ชื่อโครงการ</th>
                <th className="border p-2"rowSpan={2}>งานย่อย</th>
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
              {projects.map((project) => {
                return (
                  <React.Fragment key={project.projectId}>
                    {project.subProjects.map((sp, spIndex) => (
                      <tr key={sp.subProjectId}>
                        {/* ✅ Project name only on first subproject row */}
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
                              <td className="border p-2 text-right font-bold">{formatNumber(
                                b.ผูกพัน.เงินกู้ +
                                b.ผูกพัน.เงินรายได้ +
                                b.ลงทุน.เงินกู้ +
                                b.ลงทุน.เงินรายได้
                              )}</td>

                              <td className="border p-2 text-right">{formatNumber(u.ผูกพัน.เงินกู้ + u.ผูกพัน.เงินรายได้)}</td>
                              <td className="border p-2 text-right">{formatNumber(u.ลงทุน.เงินกู้ + u.ลงทุน.เงินรายได้)}</td>
                              <td className="border p-2 text-right font-bold">{formatNumber(
                                u.ผูกพัน.เงินกู้ +
                                u.ผูกพัน.เงินรายได้ +
                                u.ลงทุน.เงินกู้ +
                                u.ลงทุน.เงินรายได้
                              )}</td>

                              <td className="border p-2 text-right">{formatNumber(remaining)}</td>
                              <td className="border p-2"></td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    ))}

                    {/* ✅ แถว: เงินกู้ */}
                    <tr>
                      <td className="border p-2 text-left font-bold">เงินกู้</td>
                      {uniqueYears.map((year) => (
                        <React.Fragment key={`loan-${project.projectId}-${year}`}>
                          {Array(6)
                            .fill(null)
                            .map((_, i) => (
                              <td key={`loan-${year}-${i}`} className="border p-2">
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

                    {/* ✅ แถว: รายได้ */}
                    <tr>
                      <td className="border p-2 text-left font-bold">เงินรายได้</td>
                      {uniqueYears.map((year) => (
                        <React.Fragment key={`rev-${project.projectId}-${year}`}>
                          {Array(6)
                            .fill(null)
                            .map((_, i) => (
                              <td key={`rev-${year}-${i}`} className="border p-2">
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
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            ❌ ปฏิเสธ
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            ✅ อนุมัติ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmApprove;
