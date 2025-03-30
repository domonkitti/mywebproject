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

  // We'll track user’s input for เงินกู้ + เงินรายได้ in state,
  // so that we can do the “vertical sum” row under those two rows.
  const [moneyInputs, setMoneyInputs] = useState<{
    [year: number]: [number[], number[]]; // 2 rows (เงินกู้, เงินรายได้), each with 6 columns
  }>({});

  // This helper updates a single cell in moneyInputs
  const handleInputChange = (
    year: number,
    rowIndex: number, // 0 => เงินกู้, 1 => เงินรายได้
    colIndex: number, // 0..5 for the 6 columns
    value: number
  ) => {
    setMoneyInputs((prev) => {
      // if we never stored anything for this year, create a default structure
      if (!prev[year]) {
        prev[year] = [
          [0, 0, 0, 0, 0, 0], // row 0 => เงินกู้
          [0, 0, 0, 0, 0, 0], // row 1 => เงินรายได้
        ];
      }
      const newYearData = [...prev[year].map((arr) => [...arr])]; // clone
      newYearData[rowIndex][colIndex] = value;
      return {
        ...prev,
        [year]: newYearData,
      };
    });
  };

  useEffect(() => {
    if (!projectId) return;
    getMockProjectById(projectId).then((data) => {
      setProject(data);
      const years = data.subProjects.flatMap((sp: any) =>
        sp.budgetPlan.map((bp: any) => bp.year)
      );
      setUniqueYears(Array.from(new Set(years)).sort((a, b) => a - b));
    });
  }, [projectId]);

  if (!project) return <p className="text-center">กำลังโหลด...</p>;

  // A helper to sum data from each subProject for a given year & column type
  const sumSubProjects = (
    subProjects: any[],
    year: number,
    section: "budgetAllocated" | "budgetUsage",
    group: "ผูกพัน" | "ลงทุน"
  ) => {
    return subProjects.reduce((total, sp) => {
      const plan = sp.budgetPlan.find((bp: any) => bp.year === year);
      if (!plan) return total;
      const val = plan[section]?.[group].เงินกู้ + plan[section]?.[group].เงินรายได้;
      return total + (val || 0);
    }, 0);
  };

  // Sums budgetAllocated or budgetUsage (both ผูกพัน + ลงทุน)
  const sumAllTypes = (
    subProjects: any[],
    year: number,
    section: "budgetAllocated" | "budgetUsage"
  ) => {
    const totalผูกพัน = sumSubProjects(subProjects, year, section, "ผูกพัน");
    const totalลงทุน = sumSubProjects(subProjects, year, section, "ลงทุน");
    return totalผูกพัน + totalลงทุน;
  };

  // Sums “remaining” across subprojects: (allocated total - usage total).
  const sumRemaining = (subProjects: any[], year: number) => {
    const alloc = sumAllTypes(subProjects, year, "budgetAllocated");
    const usage = sumAllTypes(subProjects, year, "budgetUsage");
    return alloc - usage;
  };

  // Handlers for the three buttons
  const handleApprove = () => {
    // TODO: Implement your "Approve" logic here
    alert("Approved!");
  };

  const handleApproveAndCopy = () => {
    // TODO: Implement your "Approve and Copy" logic here
    alert("Approved and Copied!");
  };

  const handleReject = () => {
    // TODO: Implement your "Reject" logic here
    alert("Rejected!");
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
              <th className="border p-2" rowSpan={2}>
                ชื่อโครงการ
              </th>
              <th className="border p-2" rowSpan={2}>
                งานย่อย
              </th>
              {uniqueYears.map((year) => (
                <React.Fragment key={`year-${year}`}>
                  <th className="border p-2" colSpan={3}>
                    งบประมาณปี {year}
                  </th>
                  <th className="border p-2" colSpan={3}>
                    เบิกจ่ายปี {year}
                  </th>
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
            {project.subProjects.map((sp: any, spIndex: number) => (
              <tr key={sp.subProjectId}>
                {spIndex === 0 && (
                  <td
                    className="border p-2 font-bold text-left"
                    rowSpan={project.subProjects.length + 4}
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
                  const bp = sp.budgetPlan.find((bp: any) => bp.year === year);
                  if (!bp) {
                    return Array(8)
                      .fill(null)
                      .map((_, i) => (
                        <td key={`empty-${year}-${i}`} className="border p-2"></td>
                      ));
                  }

                  const b = bp.budgetAllocated;
                  const u = bp.budgetUsage;
                  const sumSection = (obj: any) =>
                    obj.ผูกพัน.เงินกู้ +
                    obj.ผูกพัน.เงินรายได้ +
                    obj.ลงทุน.เงินกู้ +
                    obj.ลงทุน.เงินรายได้;
                  const allocatedSum = sumSection(b);
                  const usageSum = sumSection(u);
                  const remaining = allocatedSum - usageSum;

                  return (
                    <React.Fragment key={`data-${year}`}>
                      {/* Allocated: ผูกพัน */}
                      <td className="border p-2 text-right">
                        {formatNumber(b.ผูกพัน.เงินกู้ + b.ผูกพัน.เงินรายได้)}
                      </td>
                      {/* Allocated: ลงทุน */}
                      <td className="border p-2 text-right">
                        {formatNumber(b.ลงทุน.เงินกู้ + b.ลงทุน.เงินรายได้)}
                      </td>
                      {/* Allocated: รวม */}
                      <td className="border p-2 text-right font-bold">
                        {formatNumber(allocatedSum)}
                      </td>

                      {/* Usage: ผูกพัน */}
                      <td className="border p-2 text-right">
                        {formatNumber(u.ผูกพัน.เงินกู้ + u.ผูกพัน.เงินรายได้)}
                      </td>
                      {/* Usage: ลงทุน */}
                      <td className="border p-2 text-right">
                        {formatNumber(u.ลงทุน.เงินกู้ + u.ลงทุน.เงินรายได้)}
                      </td>
                      {/* Usage: รวม */}
                      <td className="border p-2 text-right font-bold">
                        {formatNumber(usageSum)}
                      </td>

                      {/* Remaining */}
                      <td className="border p-2 text-right">
                        {formatNumber(remaining)}
                      </td>
                      {/* ตัดทิ้ง */}
                      <td className="border p-2"></td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}

            {/* รวมงานย่อย (sum of all subProjects) */}
            <tr>
              <td className="border p-2 text-right font-bold" colSpan={1}>
                รวมงานย่อย
              </td>
              {uniqueYears.map((year) => {
                const totalผูกพันAllocated = sumSubProjects(
                  project.subProjects,
                  year,
                  "budgetAllocated",
                  "ผูกพัน"
                );
                const totalลงทุนAllocated = sumSubProjects(
                  project.subProjects,
                  year,
                  "budgetAllocated",
                  "ลงทุน"
                );
                const totalAllocated = totalผูกพันAllocated + totalลงทุนAllocated;

                const totalผูกพันUsage = sumSubProjects(
                  project.subProjects,
                  year,
                  "budgetUsage",
                  "ผูกพัน"
                );
                const totalลงทุนUsage = sumSubProjects(
                  project.subProjects,
                  year,
                  "budgetUsage",
                  "ลงทุน"
                );
                const totalUsage = totalผูกพันUsage + totalลงทุนUsage;

                const totalRemain = sumRemaining(project.subProjects, year);

                return (
                  <React.Fragment key={`sub-sum-${year}`}>
                    <td className="border p-2 text-right">
                      {formatNumber(totalผูกพันAllocated)}
                    </td>
                    <td className="border p-2 text-right">
                      {formatNumber(totalลงทุนAllocated)}
                    </td>
                    <td className="border p-2 text-right font-bold">
                      {formatNumber(totalAllocated)}
                    </td>
                    <td className="border p-2 text-right">
                      {formatNumber(totalผูกพันUsage)}
                    </td>
                    <td className="border p-2 text-right">
                      {formatNumber(totalลงทุนUsage)}
                    </td>
                    <td className="border p-2 text-right font-bold">
                      {formatNumber(totalUsage)}
                    </td>
                    <td className="border p-2 text-right">
                      {formatNumber(totalRemain)}
                    </td>
                    <td className="border p-2"></td>
                  </React.Fragment>
                );
              })}
            </tr>

            {/* เงินกู้ */}
            <tr>
              <td className="border p-2 text-left font-bold" colSpan={1}>
                เงินกู้
              </td>
              {uniqueYears.map((year) => {
                return (
                  <React.Fragment key={`loan-input-${year}`}>
                    {Array.from({ length: 6 }).map((_, colIndex) => (
                      <td key={`loan-cell-${year}-${colIndex}`} className="border p-2">
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full text-right border px-1"
                          value={
                            moneyInputs[year]?.[0]?.[colIndex] !== undefined
                              ? moneyInputs[year][0][colIndex]
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              year,
                              0, // row 0 => เงินกู้
                              colIndex,
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>
                    ))}
                    <td className="border p-2"></td>
                    <td className="border p-2"></td>
                  </React.Fragment>
                );
              })}
            </tr>

            {/* เงินรายได้ */}
            <tr>
              <td className="border p-2 text-left font-bold" colSpan={1}>
                เงินรายได้
              </td>
              {uniqueYears.map((year) => (
                <React.Fragment key={`rev-input-${year}`}>
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <td key={`rev-cell-${year}-${colIndex}`} className="border p-2">
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full text-right border px-1"
                        value={
                          moneyInputs[year]?.[1]?.[colIndex] !== undefined
                            ? moneyInputs[year][1][colIndex]
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            year,
                            1, // row 1 => เงินรายได้
                            colIndex,
                            Number(e.target.value)
                          )
                        }
                      />
                    </td>
                  ))}
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                </React.Fragment>
              ))}
            </tr>

            {/* รวม (เงินกู้ + เงินรายได้) */}
            <tr>
              <td className="border p-2 text-left font-bold" colSpan={1}>
                รวม (เงินกู้ + เงินรายได้)
              </td>
              {uniqueYears.map((year) => {
                const dataForYear = moneyInputs[year] || [
                  [0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0],
                ];
                return (
                  <React.Fragment key={`combined-sum-${year}`}>
                    {Array.from({ length: 6 }).map((_, colIndex) => {
                      const loanVal = dataForYear[0][colIndex] || 0;
                      const revenueVal = dataForYear[1][colIndex] || 0;
                      const combined = loanVal + revenueVal;
                      return (
                        <td
                          key={`combined-${year}-${colIndex}`}
                          className="border p-2 text-right"
                        >
                          {formatNumber(combined)}
                        </td>
                      );
                    })}
                    <td className="border p-2"></td>
                    <td className="border p-2"></td>
                  </React.Fragment>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* -- 3 Buttons: Approve, Approve & Copy, Reject -- */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={handleApprove}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Approve
        </button>

        <button
          onClick={handleApproveAndCopy}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
        >
          Approve &amp; Copy
        </button>

        <button
          onClick={handleReject}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ConfirmApprovePage;
