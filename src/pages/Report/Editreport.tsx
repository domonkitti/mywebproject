import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Mock API call returning project details.
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

  // Initialize state for the admin input rows using empty strings
  const [loanValues, setLoanValues] = useState({});
  const [incomeValues, setIncomeValues] = useState({});
  const [sumCutValues, setSumCutValues] = useState({});

  useEffect(() => {
    if (!projectId) return;
    getMockProjectById(projectId).then((data) => {
      setProject(data);
      const years = data.subProjects.flatMap((sp) =>
        sp.budgetPlan.map((bp) => bp.year)
      );
      const unique = Array.from(new Set(years)).sort((a, b) => a - b);
      setUniqueYears(unique);
    });
  }, [projectId]);

  // Initialize each year with an array of 8 empty strings.
  useEffect(() => {
    if (uniqueYears.length > 0) {
      const initialRow = {};
      uniqueYears.forEach((year) => {
        initialRow[year] = Array(8).fill("");
      });
      setLoanValues(initialRow);
      setIncomeValues(initialRow);

      const initialSumCut = {};
      uniqueYears.forEach((year) => {
        initialSumCut[year] = "";
      });
      setSumCutValues(initialSumCut);
    }
  }, [uniqueYears]);

  if (!project) return <p className="text-center">กำลังโหลด...</p>;

  // Helper function to sum budget values from sub-projects.
  const sumBudget = (items, year, type, source, isUsage = false) => {
    return items.reduce((acc, curr) => {
      const plan = curr.budgetPlan.find((bp) => bp.year === year);
      const budgetType = isUsage ? "budgetUsage" : "budgetAllocated";
      return acc + (plan?.[budgetType]?.[type]?.[source] || 0);
    }, 0);
  };

  // Computed placeholder values for Allocated fields.
  const loanPlaceholderBond = {};
  const loanPlaceholderInvest = {};
  const incomePlaceholderBond = {};

  uniqueYears.forEach((year) => {
    loanPlaceholderBond[year] = project.subProjects.reduce((acc, sp) => {
      const bp = sp.budgetPlan.find((bp) => bp.year === year);
      return bp ? acc + (bp.budgetAllocated["ผูกพัน"]["เงินกู้"] || 0) : acc;
    }, 0);
    loanPlaceholderInvest[year] = project.subProjects.reduce((acc, sp) => {
      const bp = sp.budgetPlan.find((bp) => bp.year === year);
      return bp ? acc + (bp.budgetAllocated["ลงทุน"]["เงินกู้"] || 0) : acc;
    }, 0);
    incomePlaceholderBond[year] = project.subProjects.reduce((acc, sp) => {
      const bp = sp.budgetPlan.find((bp) => bp.year === year);
      return bp ? acc + (bp.budgetAllocated["ผูกพัน"]["เงินรายได้"] || 0) : acc;
    }, 0);
  });

  // Computed placeholders for Usage fields.
  const loanUsageBond = {};
  const loanUsageInvest = {};
  const incomeUsageBond = {};
  const incomeUsageInvest = {};

  uniqueYears.forEach((year) => {
    loanUsageBond[year] = project.subProjects.reduce((acc, sp) => {
      const bp = sp.budgetPlan.find((bp) => bp.year === year);
      return bp ? acc + (bp.budgetUsage["ผูกพัน"]["เงินกู้"] || 0) : acc;
    }, 0);
    loanUsageInvest[year] = project.subProjects.reduce((acc, sp) => {
      const bp = sp.budgetPlan.find((bp) => bp.year === year);
      return bp ? acc + (bp.budgetUsage["ลงทุน"]["เงินกู้"] || 0) : acc;
    }, 0);
    incomeUsageBond[year] = project.subProjects.reduce((acc, sp) => {
      const bp = sp.budgetPlan.find((bp) => bp.year === year);
      return bp ? acc + (bp.budgetUsage["ผูกพัน"]["เงินรายได้"] || 0) : acc;
    }, 0);
    incomeUsageInvest[year] = project.subProjects.reduce((acc, sp) => {
      const bp = sp.budgetPlan.find((bp) => bp.year === year);
      return bp ? acc + (bp.budgetUsage["ลงทุน"]["เงินรายได้"] || 0) : acc;
    }, 0);
  });

  // Update change handlers: allow empty string or number.
  const handleLoanChange = (year, index, value) => {
    const newVal = value === "" ? "" : Number(value);
    setLoanValues((prev) => ({
      ...prev,
      [year]: prev[year].map((val, i) => (i === index ? newVal : val)),
    }));
  };

  const handleIncomeChange = (year, index, value) => {
    const newVal = value === "" ? "" : Number(value);
    setIncomeValues((prev) => ({
      ...prev,
      [year]: prev[year].map((val, i) => (i === index ? newVal : val)),
    }));
  };

  const handleSumCutChange = (year, value) => {
    const newVal = value === "" ? "" : Number(value);
    setSumCutValues((prev) => ({
      ...prev,
      [year]: newVal,
    }));
  };

  // A helper that returns a numeric value; if the input is empty, returns undefined.
  const parseOrUndefined = (val) => (val === "" ? undefined : Number(val));

  // Updated computeSumRow: if an admin cell is empty, use the computed placeholder.
  const computeSumRow = (year, colIndex) => {
    const loanRow = loanValues[year] || Array(8).fill("");
    const incomeRow = incomeValues[year] || Array(8).fill("");

    if (colIndex === 0) {
      // Allocated, ผูกพัน for เงินกู้ and เงินรายได้:
      const loanVal =
        loanRow[0] !== ""
          ? Number(loanRow[0])
          : loanPlaceholderBond[year] || 0;
      const incomeVal =
        incomeRow[0] !== ""
          ? Number(incomeRow[0])
          : incomePlaceholderBond[year] || 0;
      return loanVal + incomeVal;
    } else if (colIndex === 1) {
      // Allocated, ลงทุน for เงินกู้. (For เงินรายได้ allocated invest, no placeholder given so default to 0)
      const loanVal =
        loanRow[1] !== ""
          ? Number(loanRow[1])
          : loanPlaceholderInvest[year] || 0;
      const incomeVal =
        incomeRow[1] !== "" ? Number(incomeRow[1]) : 0;
      return loanVal + incomeVal;
    } else if (colIndex === 2) {
      // Sum of allocated = column0 + column1.
      return computeSumRow(year, 0) + computeSumRow(year, 1);
    } else if (colIndex === 3) {
      // Usage, ผูกพัน for เงินกู้ and เงินรายได้.
      const loanVal =
        loanRow[3] !== ""
          ? Number(loanRow[3])
          : loanUsageBond[year] || 0;
      const incomeVal =
        incomeRow[3] !== ""
          ? Number(incomeRow[3])
          : incomeUsageBond[year] || 0;
      return loanVal + incomeVal;
    } else if (colIndex === 4) {
      // Usage, ลงทุน for เงินกู้ and เงินรายได้.
      const loanVal =
        loanRow[4] !== ""
          ? Number(loanRow[4])
          : loanUsageInvest[year] || 0;
      const incomeVal =
        incomeRow[4] !== ""
          ? Number(incomeRow[4])
          : incomeUsageInvest[year] || 0;
      return loanVal + incomeVal;
    } else if (colIndex === 5) {
      // Sum of usage = column3 + column4.
      return computeSumRow(year, 3) + computeSumRow(year, 4);
    } else if (colIndex === 6) {
      // Remaining = allocated total - usage total - sumCut.
      const allocated = computeSumRow(year, 2);
      const usage = computeSumRow(year, 5);
      const cut =
        sumCutValues[year] !== "" ? Number(sumCutValues[year]) : 0;
      return allocated - usage - cut;
    } else if (colIndex === 7) {
      // For the cut input column, just return an empty string.
      return "";
    }
    return "";
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        รายละเอียดโครงการ: {project.projectName}()
      </h2>
      <div className="overflow-auto">
        <table className="w-full text-sm border border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="border p-2" rowSpan={2}>
                ชื่อโครงการ / งานย่อย
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
            {/* งานย่อย rows */}
            {project.subProjects.map((sp) => (
              <tr key={sp.subProjectId}>
                <td className="border p-2 text-left">{sp.subProjectName}</td>
                {uniqueYears.map((year) => {
                  const bp = sp.budgetPlan.find((bp) => bp.year === year);
                  if (!bp)
                    return Array(8)
                      .fill(null)
                      .map((_, i) => (
                        <td key={`empty-${year}-${i}`} className="border p-2"></td>
                      ));
                  const b = bp.budgetAllocated;
                  const u = bp.budgetUsage;
                  const sum = (obj) =>
                    obj.ผูกพัน.เงินกู้ +
                    obj.ผูกพัน.เงินรายได้ +
                    obj.ลงทุน.เงินกู้ +
                    obj.ลงทุน.เงินรายได้;
                  const remaining = sum(b) - sum(u);
                  return (
                    <React.Fragment key={`data-${year}-${sp.subProjectId}`}>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full text-right border px-1"
                          placeholder="0"
                          defaultValue={b.ผูกพัน.เงินกู้ + b.ผูกพัน.เงินรายได้}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full text-right border px-1"
                          placeholder="0"
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
                          placeholder="0"
                          defaultValue={u.ผูกพัน.เงินกู้ + u.ผูกพัน.เงินรายได้}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full text-right border px-1"
                          placeholder="0"
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
                      <td className="border p-2 text-right">
                        {formatNumber(remaining)}
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full text-right border px-1"
                          placeholder="0"
                        />
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}

                        {/* รวมงานย่อย row */}
                        <tr>
              <td className="border p-2 text-left font-bold">รวมงานย่อย</td>
              {uniqueYears.map((year) => {
                // For allocated values:
                const bondLoan = sumBudget(
                  project.subProjects,
                  year,
                  "ผูกพัน",
                  "เงินกู้"
                );
                const bondIncome = sumBudget(
                  project.subProjects,
                  year,
                  "ผูกพัน",
                  "เงินรายได้"
                );
                const investLoan = sumBudget(
                  project.subProjects,
                  year,
                  "ลงทุน",
                  "เงินกู้"
                );
                const investIncome = sumBudget(
                  project.subProjects,
                  year,
                  "ลงทุน",
                  "เงินรายได้"
                );
                const bondAllocated = bondLoan + bondIncome;
                const investAllocated = investLoan + investIncome;
                const totalAllocated = bondAllocated + investAllocated;

                // For usage values:
                const bondLoanUsage = sumBudget(
                  project.subProjects,
                  year,
                  "ผูกพัน",
                  "เงินกู้",
                  true
                );
                const bondIncomeUsage = sumBudget(
                  project.subProjects,
                  year,
                  "ผูกพัน",
                  "เงินรายได้",
                  true
                );
                const investLoanUsage = sumBudget(
                  project.subProjects,
                  year,
                  "ลงทุน",
                  "เงินกู้",
                  true
                );
                const investIncomeUsage = sumBudget(
                  project.subProjects,
                  year,
                  "ลงทุน",
                  "เงินรายได้",
                  true
                );
                const bondUsage = bondLoanUsage + bondIncomeUsage;
                const investUsage = investLoanUsage + investIncomeUsage;
                const totalUsage = bondUsage + investUsage;

                // Remaining: allocated - usage.
                const remaining = totalAllocated - totalUsage;

                return (
                  <React.Fragment key={`sum-subproject-${year}`}>
                    {/* Allocated ผูกพัน: */}
                    <td className="border p-2 text-right font-bold  bg-gray-100" >
                      {formatNumber(bondAllocated)}
                    </td>
                    {/* Allocated ลงทุน: */}
                    <td className="border p-2 text-right font-bold bg-gray-100">
                      {formatNumber(investAllocated)}
                    </td>
                    {/* Allocated Total: */}
                    <td className="border p-2 text-right font-bold bg-gray-100">
                      {formatNumber(totalAllocated)}
                    </td>
                    {/* Usage ผูกพัน: */}
                    <td className="border p-2 text-right font-bold bg-gray-100">
                      {formatNumber(bondUsage)}
                    </td>
                    {/* Usage ลงทุน: */}
                    <td className="border p-2 text-right font-bold bg-gray-100">
                      {formatNumber(investUsage)}
                    </td>
                    {/* Usage Total: */}
                    <td className="border p-2 text-right font-bold bg-gray-100">
                      {formatNumber(totalUsage)}
                    </td>
                    {/* Remaining: */}
                    <td className="border p-2 text-right font-bold bg-gray-100">
                      {formatNumber(remaining)}
                    </td>
                    {/* Cut input column remains unchanged */}
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full text-right border px-1"
                        placeholder="0"
                      />
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>


            {/* แถว เงินกู้ */}
            <tr>
              <td className="border p-2 text-left font-bold">เงินกู้</td>
              {uniqueYears.map((year) => {
                const row = loanValues[year] || Array(8).fill("");
                return (
                  <React.Fragment key={`loan-${year}`}>
                    {/* Allocated section */}
                    <td className="border p-2">
                      <input
                        type="number"
                        placeholder={loanPlaceholderBond[year]}
                        className="w-full text-right border px-1"
                        value={row[0]}
                        onChange={(e) =>
                          handleLoanChange(year, 0, e.target.value)
                        }
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        placeholder={loanPlaceholderInvest[year]}
                        className="w-full text-right border px-1"
                        value={row[1]}
                        onChange={(e) =>
                          handleLoanChange(year, 1, e.target.value)
                        }
                      />
                    </td>
                    <td className="border p-2 text-right font-bold">
                      {formatNumber(
                        (row[0] !== "" ? Number(row[0]) : loanPlaceholderBond[year] || 0) +
                        (row[1] !== "" ? Number(row[1]) : loanPlaceholderInvest[year] || 0)
                      )}
                    </td>
                    {/* เบิกจ่าย section for เงินกู้ */}
                    <td className="border p-2">
                      <input
                        type="number"
                        placeholder={loanUsageBond[year]}
                        className="w-full text-right border px-1"
                        value={row[3]}
                        onChange={(e) =>
                          handleLoanChange(year, 3, e.target.value)
                        }
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        placeholder={loanUsageInvest[year]}
                        className="w-full text-right border px-1"
                        value={row[4]}
                        onChange={(e) =>
                          handleLoanChange(year, 4, e.target.value)
                        }
                      />
                    </td>
                    <td className="border p-2 text-right font-bold">
                      {formatNumber(
                        (row[3] !== "" ? Number(row[3]) : loanUsageBond[year] || 0) +
                        (row[4] !== "" ? Number(row[4]) : loanUsageInvest[year] || 0)
                      )}
                    </td>
                    <td className="border p-2 text-right font-bold">
                      {formatNumber(
                        ((row[0] !== "" ? Number(row[0]) : loanPlaceholderBond[year] || 0) +
                          (row[1] !== "" ? Number(row[1]) : loanPlaceholderInvest[year] || 0)) -
                        ((row[3] !== "" ? Number(row[3]) : loanUsageBond[year] || 0) +
                          (row[4] !== "" ? Number(row[4]) : loanUsageInvest[year] || 0))
                      )}
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full text-right border px-1"
                        value={row[7]}
                        onChange={(e) =>
                          handleLoanChange(year, 7, e.target.value)
                        }
                      />
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>

            {/* แถว เงินรายได้ */}
            <tr>
              <td className="border p-2 text-left font-bold">เงินรายได้</td>
              {uniqueYears.map((year) => {
                const row = incomeValues[year] || Array(8).fill("");
                return (
                  <React.Fragment key={`income-${year}`}>
                    {/* Allocated section */}
                    <td className="border p-2">
                      <input
                        type="number"
                        placeholder={incomePlaceholderBond[year]}
                        className="w-full text-right border px-1"
                        value={row[0]}
                        onChange={(e) =>
                          handleIncomeChange(year, 0, e.target.value)
                        }
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full text-right border px-1"
                        value={row[1]}
                        onChange={(e) =>
                          handleIncomeChange(year, 1, e.target.value)
                        }
                      />
                    </td>
                    <td className="border p-2 text-right font-bold">
                      {formatNumber(
                        (row[0] !== "" ? Number(row[0]) : incomePlaceholderBond[year] || 0) +
                        (row[1] !== "" ? Number(row[1]) : 0)
                      )}
                    </td>
                    {/* เบิกจ่าย section for เงินรายได้ */}
                    <td className="border p-2">
                      <input
                        type="number"
                        placeholder={incomeUsageBond[year]}
                        className="w-full text-right border px-1"
                        value={row[3]}
                        onChange={(e) =>
                          handleIncomeChange(year, 3, e.target.value)
                        }
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        placeholder={incomeUsageInvest[year]}
                        className="w-full text-right border px-1"
                        value={row[4]}
                        onChange={(e) =>
                          handleIncomeChange(year, 4, e.target.value)
                        }
                      />
                    </td>
                    <td className="border p-2 text-right font-bold">
                      {formatNumber(
                        (row[3] !== "" ? Number(row[3]) : incomeUsageBond[year] || 0) +
                        (row[4] !== "" ? Number(row[4]) : incomeUsageInvest[year] || 0)
                      )}
                    </td>
                    <td className="border p-2 text-right font-bold">
                      {formatNumber(
                        ((row[0] !== "" ? Number(row[0]) : incomePlaceholderBond[year] || 0) +
                          (row[1] !== "" ? Number(row[1]) : 0)) -
                        ((row[3] !== "" ? Number(row[3]) : incomeUsageBond[year] || 0) +
                          (row[4] !== "" ? Number(row[4]) : incomeUsageInvest[year] || 0))
                      )}
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full text-right border px-1"
                        value={row[7]}
                        onChange={(e) =>
                          handleIncomeChange(year, 7, e.target.value)
                        }
                      />
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>

            {/* แถว รวมเงินกู้/เงินรายได้ */}
            <tr>
              <td className="border p-2 text-left font-bold">
                รวมเงินกู้/เงินรายได้
              </td>
              {uniqueYears.map((year) => (
                <React.Fragment key={`sum-${year}`}>
                  {Array(8)
                    .fill(null)
                    .map((_, i) => {
                      if (i === 7) {
                        return (
                          <td key={`sum-${year}-${i}`} className="border p-2">
                            <input
                              type="number"
                              placeholder="0"
                              className="w-full text-right border px-1"
                              value={sumCutValues[year] || ""}
                              onChange={(e) =>
                                handleSumCutChange(year, e.target.value)
                              }
                            />
                          </td>
                        );
                      } else {
                        return (
                          <td
                            key={`sum-${year}-${i}`}
                            className="border p-2 bg-gray-100 text-right font-bold"
                          >
                            {formatNumber(computeSumRow(year, i))}
                          </td>
                        );
                      }
                    })}
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
