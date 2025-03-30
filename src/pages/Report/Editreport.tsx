import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoPencil } from "react-icons/io5";

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

const formatNumber = (num) => 
    isNaN(num) ? "-" : num.toLocaleString("th-TH", { minimumFractionDigits: 0 });
  
  const EditableTable = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [uniqueYears, setUniqueYears] = useState([]);
  
    useEffect(() => {
      if (!projectId) return;
      getMockProjectById(projectId).then((data) => {
        setProject(data);
        const years = data.subProjects.flatMap((sp) => sp.budgetPlan.map((bp) => bp.year));
        setUniqueYears(Array.from(new Set(years)).sort((a, b) => a - b));
      });
    }, [projectId]);
  
    if (!project) return <p className="text-center">กำลังโหลด...</p>;
  
    const sumBudget = (items, year, type, source, isUsage = false) => {
        return items.reduce((acc, curr) => {
          const plan = curr.budgetPlan.find((bp) => bp.year === year);
          const budgetType = isUsage ? 'budgetUsage' : 'budgetAllocated';
          return acc + (plan?.[budgetType]?.[type]?.[source] || 0);
        }, 0);
      };
  
    const sumAll = (items, year, type) => {
      return ["เงินกู้", "เงินรายได้"].reduce(
        (acc, source) => acc + sumBudget(items, year, type, source),
        0
      );
    };
    
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        รายละเอียดโครงการ: {project.projectName}
      </h2>
      <div className="overflow-auto">
        <table className="w-full text-sm border border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="border p-2" rowSpan={2}>ชื่อโครงการ / งานย่อย</th>
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


          {/* แถว 2–n: งานย่อยทั้งหมด */}
          {project.subProjects.map((sp) => (
            <tr key={sp.subProjectId}>
              <td className="border p-2 text-left">{sp.subProjectName}</td>
              {uniqueYears.map((year) => {
                const bp = sp.budgetPlan.find((bp) => bp.year === year);
                if (!bp)
                  return Array(8).fill(null).map((_, i) => (
                    <td key={`empty-${year}-${i}`} className="border p-2"></td>
                  ));

                const b = bp.budgetAllocated;
                const u = bp.budgetUsage;
                const sum = (obj) =>
                  obj.ผูกพัน.เงินกู้ + obj.ผูกพัน.เงินรายได้ + obj.ลงทุน.เงินกู้ + obj.ลงทุน.เงินรายได้;
                const remaining = sum(b) - sum(u);

                return (
                  <React.Fragment key={`data-${year}-${sp.subProjectId}`}>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full text-right border px-1"
                        defaultValue={b.ผูกพัน.เงินกู้ + b.ผูกพัน.เงินรายได้}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full text-right border px-1"
                        defaultValue={b.ลงทุน.เงินกู้ + b.ลงทุน.เงินรายได้}
                      />
                    </td>
                    <td className="border p-2 font-bold">
                      <input
                        type="number"
                        className="w-full text-right border px-1 font-bold"
                        defaultValue={sum(b)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full text-right border px-1"
                        defaultValue={u.ผูกพัน.เงินกู้ + u.ผูกพัน.เงินรายได้}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full text-right border px-1"
                        defaultValue={u.ลงทุน.เงินกู้ + u.ลงทุน.เงินรายได้}
                      />
                    </td>
                    <td className="border p-2 font-bold">
                      <input
                        type="number"
                        className="w-full text-right border px-1 font-bold"
                        defaultValue={sum(u)}
                      />
                    </td>
                    <td className="border p-2 text-right">{formatNumber(remaining)}</td>
                    <td className="border p-2"></td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}

            {/* แถว 3: รวมงานย่อย */}
            <tr>
              <td className="border p-2 text-left font-bold">รวมงานย่อย</td>
              {uniqueYears.map((year) => {
                const bondLoan = sumBudget(project.subProjects, year, 'ผูกพัน', 'เงินกู้');
                const bondIncome = sumBudget(project.subProjects, year, 'ผูกพัน', 'เงินรายได้');
                const investLoan = sumBudget(project.subProjects, year, 'ลงทุน', 'เงินกู้');
                const investIncome = sumBudget(project.subProjects, year, 'ลงทุน', 'เงินรายได้');
                const totalAllocated = bondLoan + bondIncome + investLoan + investIncome;
                const bondLoanUsage = sumBudget(project.subProjects, year, 'ผูกพัน', 'เงินกู้', true);
                const bondIncomeUsage = sumBudget(project.subProjects, year, 'ผูกพัน', 'เงินรายได้', true);
                const investLoanUsage = sumBudget(project.subProjects, year, 'ลงทุน', 'เงินกู้', true);
                const investIncomeUsage = sumBudget(project.subProjects, year, 'ลงทุน', 'เงินรายได้', true);
                const totalUsage = bondLoanUsage + bondIncomeUsage + investLoanUsage + investIncomeUsage;
                const remaining = totalAllocated - totalUsage;

                return (
                  <React.Fragment key={`sum-subproject-${year}`}>
                   <td className="border p-2 text-right font-bold">
                       {formatNumber(project.subProjects.reduce((total, subProject) => {
                         const budgetPlan = subProject.budgetPlan.find(plan => plan.year === year);
                        return budgetPlan ? total + budgetPlan.budgetAllocated.ผูกพัน.เงินกู้ + budgetPlan.budgetAllocated.ผูกพัน.เงินรายได้ : total;
                      }, 0))}
                    </td>
                    <td className="border p-2 text-right font-bold">{formatNumber(investLoan)}</td>
                    <td className="border p-2 text-right font-bold">{formatNumber(totalAllocated)}</td>
                    <td className="border p-2 text-right font-bold">{formatNumber(bondLoanUsage)}</td>
                    <td className="border p-2 text-right font-bold">{formatNumber(investLoanUsage)}</td>
                    <td className="border p-2 text-right font-bold">{formatNumber(totalUsage)}</td>
                    <td className="border p-2 text-right font-bold">{formatNumber(remaining)}</td>
                    <td className="border p-2"></td>
                  </React.Fragment>
                );
              })}
            </tr>

          {/* แถว 4: เงินกู้ */}
          <tr>
            <td className="border p-2 text-left font-bold">เงินกู้</td>
            {uniqueYears.map((year) => (
              <React.Fragment key={`loan-${year}`}>
                {Array(6).fill(null).map((_, i) => (
                  <td key={`loan-${year}-${i}`} className="border p-2">
                    <input type="number" className="w-full text-right border px-1" placeholder="0" />
                  </td>
                ))}
                <td className="border p-2"></td>
                <td className="border p-2"></td>
              </React.Fragment>
            ))}
          </tr>

          {/* แถว 5: เงินรายได้ */}
          <tr>
            <td className="border p-2 text-left font-bold">เงินรายได้</td>
            {uniqueYears.map((year) => (
              <React.Fragment key={`rev-${year}`}>
                {Array(6).fill(null).map((_, i) => (
                  <td key={`rev-${year}-${i}`} className="border p-2">
                    <input type="number" className="w-full text-right border px-1" placeholder="0" />
                  </td>
                ))}
                <td className="border p-2"></td>
                <td className="border p-2"></td>
              </React.Fragment>
            ))}
          </tr>

          {/* แถว 6: รวมเงินกู้/เงินรายได้ */}
          <tr>
            <td className="border p-2 text-left font-bold">รวมเงินกู้/เงินรายได้</td>
            {uniqueYears.map((year) => (
              <React.Fragment key={`sum-${year}`}>
                {Array(6).fill(null).map((_, i) => (
                  <td key={`sum-${year}-${i}`} className="border p-2 bg-gray-100"></td>
                ))}
                <td className="border p-2 bg-gray-100"></td>
                <td className="border p-2 bg-gray-100"></td>
              </React.Fragment>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

};

export default EditableTable;
