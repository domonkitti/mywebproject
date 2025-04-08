import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// --- Data Interfaces ---
interface BudgetData {
  requestDraftId: number;
  draftSubtaskId: number;
  list: string;
  year: number;
  requestPay: string;
  value: number;
  commitInvest: string;
  subtaskName: string;
}

interface YearData {
  operationCommit: number; // (ผูกพัน ของวงเงินดำเนินการ)
  operationInvest: number; // (ลงทุน ของวงเงินดำเนินการ)
  operationTotal: number;  // (รวม ของวงเงินดำเนินการ)
  targetCommit: number;    // (ผูกพัน ของเป้าหมายเบิกจ่าย)
  targetInvest: number;    // (ลงทุน ของเป้าหมายเบิกจ่าย)
  targetTotal: number;     // (รวม ของเป้าหมายเบิกจ่าย)
  cut: number;             // ตัดทิ้ง
}

interface TableData {
  [year: number]: YearData;
}

interface SubtaskSummary {
  draftSubtaskId: number;
  subtaskName: string;
  years: number[];
  tableData: TableData;
}

// --- Admin Input Interfaces ---
interface FundInput {
  requestInvest: number;
  payCommit: number;
  payInvest: number;
  cut: number;
}

interface AdminInputs {
  [year: number]: {
    loan?: FundInput;
    revenue?: FundInput;
  };
}

// --- Utility Function ---
const formatNumber = (num: number) => (num > 0 ? num.toLocaleString("th-TH") : "-");

// --- ConfirmApprovePage Component ---
const ConfirmApprovePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [loading, setLoading] = useState(true);
  const [subtaskSummaries, setSubtaskSummaries] = useState<SubtaskSummary[]>([]);
  const [unionYears, setUnionYears] = useState<number[]>([]);
  const [adminInputs, setAdminInputs] = useState<AdminInputs>({});
  // For demonstration, set a dummy project name using projectId.

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:2024/projects/getbudgetrequestsbyproject/${projectId}`);
        const result: BudgetData[] = await res.json();

        // --- Group data by draftSubtaskId ---
        const subtaskMap: Record<number, BudgetData[]> = {};
        result.forEach((item) => {
          if (!subtaskMap[item.draftSubtaskId]) {
            subtaskMap[item.draftSubtaskId] = [];
          }
          subtaskMap[item.draftSubtaskId].push(item);
        });

        const summaries: SubtaskSummary[] = [];
        Object.keys(subtaskMap).forEach((key) => {
          const group = subtaskMap[Number(key)];
          // Get the set of years for this subtask
          const yearSet = new Set<number>();
          group.forEach((item) => yearSet.add(item.year));
          const sortedYears = Array.from(yearSet).sort((a, b) => a - b);

          // Initialize table data for each year in this subtask
          const initialTableData: TableData = {};
          sortedYears.forEach((year) => {
            initialTableData[year] = {
              operationCommit: 0,
              operationInvest: 0,
              operationTotal: 0,
              targetCommit: 0,
              targetInvest: 0,
              targetTotal: 0,
              cut: 0,
            };
          });

          // Sum data for each item in the subtask
          group.forEach((item) => {
            const year = item.year;
            const isInvest = item.commitInvest.trim() === "invest";
            const isRequest = item.requestPay === "request";
            const isPay = item.requestPay === "pay";

            if (isInvest && isRequest) initialTableData[year].operationInvest += item.value;
            if (!isInvest && isRequest) initialTableData[year].operationCommit += item.value;

            if (isInvest && isPay) initialTableData[year].targetInvest += item.value;
            if (!isInvest && isPay) initialTableData[year].targetCommit += item.value;
          });

          // Compute totals for each year (for years that have data)
          sortedYears.forEach((year) => {
            const data = initialTableData[year];
            data.operationTotal = data.operationCommit + data.operationInvest;
            data.targetTotal = data.targetCommit + data.targetInvest;
          });

          // Cross-year calculation within the subtask group
          sortedYears.forEach((year, index) => {
            if (index === 0) return;
            const prevYear = sortedYears[index - 1];
            const prevData = initialTableData[prevYear];
            initialTableData[year].operationCommit = prevData.operationTotal - prevData.targetTotal;
            initialTableData[year].operationTotal = initialTableData[year].operationCommit + initialTableData[year].operationInvest;
          });

          summaries.push({
            draftSubtaskId: group[0].draftSubtaskId,
            subtaskName: group[0].subtaskName,
            years: sortedYears,
            tableData: initialTableData,
          });
        });

        // --- Create a union of years from all subtask summaries ---
        const unionYearSet = new Set<number>();
        summaries.forEach((summary) => {
          summary.years.forEach((year) => unionYearSet.add(year));
        });
        const unionYearsArr = Array.from(unionYearSet).sort((a, b) => a - b);

        // --- For each subtask, ensure tableData covers all unionYears and recalc cross-year ---
        summaries.forEach((summary) => {
          const newTableData: TableData = {};
          unionYearsArr.forEach((year) => {
            if (summary.tableData[year]) {
              newTableData[year] = { ...summary.tableData[year] };
            } else {
              newTableData[year] = {
                operationCommit: 0,
                operationInvest: 0,
                operationTotal: 0,
                targetCommit: 0,
                targetInvest: 0,
                targetTotal: 0,
                cut: 0,
              };
            }
          });
          unionYearsArr.forEach((year, index) => {
            if (index === 0) {
              const data = newTableData[year];
              data.operationTotal = data.operationCommit + data.operationInvest;
              data.targetTotal = data.targetCommit + data.targetInvest;
              return;
            }
            const prevYear = unionYearsArr[index - 1];
            const prevData = newTableData[prevYear];
            newTableData[year].operationCommit = prevData.operationTotal - prevData.targetTotal;
            newTableData[year].operationTotal = newTableData[year].operationCommit + newTableData[year].operationInvest;
            newTableData[year].targetTotal = newTableData[year].targetCommit + newTableData[year].targetInvest;
          });
          summary.tableData = newTableData;
          summary.years = unionYearsArr;
        });

        setSubtaskSummaries(summaries);
        setUnionYears(unionYearsArr);
      } catch (error) {
        console.error("Error fetching budget summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // --- Calculate totals for a subtask across all years ---
  const calcTotals = (tableData: TableData, years: number[]) => {
    const totals: YearData = {
      operationCommit: 0,
      operationInvest: 0,
      operationTotal: 0,
      targetCommit: 0,
      targetInvest: 0,
      targetTotal: 0,
      cut: 0,
    };
    years.forEach((year) => {
      const data = tableData[year];
      totals.operationCommit += data.operationCommit;
      totals.operationInvest += data.operationInvest;
      totals.operationTotal += data.operationTotal;
      totals.targetCommit += data.targetCommit;
      totals.targetInvest += data.targetInvest;
      totals.targetTotal += data.targetTotal;
      totals.cut += data.cut;
    });
    return totals;
  };

  // --- Compute overall union totals (per year) across all subtasks ---
  const overallUnionTotals = unionYears.reduce((acc, year) => {
    acc[year] = {
      operationCommit: 0,
      operationInvest: 0,
      operationTotal: 0,
      targetCommit: 0,
      targetInvest: 0,
      targetTotal: 0,
      cut: 0,
    };
    subtaskSummaries.forEach((summary) => {
      const data = summary.tableData[year];
      acc[year].operationCommit += data.operationCommit;
      acc[year].operationInvest += data.operationInvest;
      acc[year].operationTotal += data.operationTotal;
      acc[year].targetCommit += data.targetCommit;
      acc[year].targetInvest += data.targetInvest;
      acc[year].targetTotal += data.targetTotal;
      acc[year].cut += data.cut;
    });
    return acc;
  }, {} as TableData);

  // --- Compute overall grand totals across all subtasks and years ---
  const overallGrandTotals = subtaskSummaries.reduce(
    (totals, summary) => {
      const t = calcTotals(summary.tableData, unionYears);
      totals.operationCommit += t.operationCommit;
      totals.operationInvest += t.operationInvest;
      totals.operationTotal += t.operationTotal;
      totals.targetCommit += t.targetCommit;
      totals.targetInvest += t.targetInvest;
      totals.targetTotal += t.targetTotal;
      totals.cut += t.cut;
      return totals;
    },
    { operationCommit: 0, operationInvest: 0, operationTotal: 0, targetCommit: 0, targetInvest: 0, targetTotal: 0, cut: 0 }
  );

  // --- Admin Inputs Logic (same as before) ---
  const handleFundInputChange = (
    year: number,
    fundType: "loan" | "revenue",
    field: keyof FundInput,
    value: string
  ) => {
    const numVal = parseFloat(value) || 0;
    setAdminInputs((prev) => {
      const newData = { ...(prev[year]?.[fundType] || {}) } as FundInput;
      newData[field] = numVal;
      return {
        ...prev,
        [year]: {
          ...prev[year],
          [fundType]: newData,
        },
      };
    });
  };

  const calcRequestCommit = (i: number, previousBalances: number[]): number => {
    if (i === 0) return 0;
    return previousBalances[i - 1] || 0;
  };

  const getFundData = (year: number, fundType: "loan" | "revenue"): FundInput => {
    return (
      adminInputs[year]?.[fundType] || {
        requestInvest: 0,
        payCommit: 0,
        payInvest: 0,
        cut: 0,
      }
    );
  };

  // --- Render Admin Fund Row with computed overall totals ---
  const renderFundRow = (label: string, fundType: "loan" | "revenue") => {
    let previousBalances: number[] = [];
    let overallOperation = 0;
    let overallTarget = 0;
    const cells = unionYears.map((year, i) => {
      const fundData = getFundData(year, fundType);
      const requestCommit = i === 0 ? 0 : previousBalances[i - 1];
      const reqInvest = fundData.requestInvest || 0;
      const sumReq = requestCommit + reqInvest;
      const payCommit = fundData.payCommit || 0;
      const payInvest = fundData.payInvest || 0;
      const sumPay = payCommit + payInvest;
      const cut = fundData.cut || 0;
      const balance = sumReq - sumPay - cut;
      previousBalances.push(balance);
      overallOperation += sumReq;
      overallTarget += sumPay;
      return (
        <React.Fragment key={year}>
          <td className="border p-3 text-right text-lg">{formatNumber(requestCommit)}</td>
          <td className="border p-3 text-center">
            <input
              type="number"
              className="border p-2 w-full text-right text-lg"
              value={fundData.requestInvest || ""}
              onChange={(e) => handleFundInputChange(year, fundType, "requestInvest", e.target.value)}
            />
          </td>
          <td className="border p-3 text-right font-bold text-lg">{formatNumber(sumReq)}</td>
          <td className="border p-3 text-center">
            <input
              type="number"
              className="border p-2 w-full text-right text-lg"
              value={fundData.payCommit || ""}
              onChange={(e) => handleFundInputChange(year, fundType, "payCommit", e.target.value)}
            />
          </td>
          <td className="border p-3 text-center">
            <input
              type="number"
              className="border p-2 w-full text-right text-lg"
              value={fundData.payInvest || ""}
              onChange={(e) => handleFundInputChange(year, fundType, "payInvest", e.target.value)}
            />
          </td>
          <td className="border p-3 text-right font-bold text-lg">{formatNumber(sumPay)}</td>
          <td className="border p-3 text-center">
            <input
              type="number"
              className="border p-2 w-full text-right text-lg"
              value={fundData.cut || ""}
              onChange={(e) => handleFundInputChange(year, fundType, "cut", e.target.value)}
            />
          </td>
        </React.Fragment>
      );
    });

    return (
      <tr>
        <td className="border p-3 text-center font-bold text-lg">{label}</td>
        {cells}
        <td className="border p-3 text-right font-bold text-lg">{formatNumber(overallOperation)}</td>
        <td className="border p-3 text-right font-bold text-lg">{formatNumber(overallTarget)}</td>
      </tr>
    );
  };

  // --- Render Sum Fund Row (combining both loan and revenue) with overall totals ---
  const renderSumFundRow = () => {
    let previousBalance: number = 0;
    let overallOperation = 0;
    let overallTarget = 0;
    const cells = unionYears.map((year, i) => {
      const loanData = getFundData(year, "loan");
      const revenueData = getFundData(year, "revenue");
      const reqInvest = (loanData.requestInvest || 0) + (revenueData.requestInvest || 0);
      const requestCommit = i === 0 ? 0 : previousBalance;
      const sumReq = requestCommit + reqInvest;
      const payCommit = (loanData.payCommit || 0) + (revenueData.payCommit || 0);
      const payInvest = (loanData.payInvest || 0) + (revenueData.payInvest || 0);
      const sumPay = payCommit + payInvest;
      const cut = (loanData.cut || 0) + (revenueData.cut || 0);
      const balance = sumReq - sumPay - cut;
      previousBalance = balance;
      overallOperation += sumReq;
      overallTarget += sumPay;
      return (
        <React.Fragment key={year}>
          <td className="border p-3 text-right text-lg">{formatNumber(requestCommit)}</td>
          <td className="border p-3 text-right text-lg">{formatNumber(reqInvest)}</td>
          <td className="border p-3 text-right font-bold text-lg">{formatNumber(sumReq)}</td>
          <td className="border p-3 text-right text-lg">{formatNumber(payCommit)}</td>
          <td className="border p-3 text-right text-lg">{formatNumber(payInvest)}</td>
          <td className="border p-3 text-right font-bold text-lg">{formatNumber(sumPay)}</td>
          <td className="border p-3 text-right text-lg">{formatNumber(cut)}</td>
        </React.Fragment>
      );
    });

    return (
      <tr className="bg-gray-50 font-semibold">
        <td className="border p-3 text-center text-lg">รวมเงิน</td>
        {cells}
        <td className="border p-3 text-right font-bold text-lg">{formatNumber(overallOperation)}</td>
        <td className="border p-3 text-right font-bold text-lg">{formatNumber(overallTarget)}</td>
      </tr>
    );
  };

  if (loading) return <p className="text-center text-2xl">กำลังโหลดข้อมูล...</p>;
  if (subtaskSummaries.length === 0)
    return <p className="text-center text-2xl text-gray-500">ไม่มีข้อมูล</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-2">รายละเอียด(งาน/แผนงาน/โครงการ)</h2>
      {/* Display Project Name below the heading */}
      <div className="text-center text-2xl mb-4">ชื่อ</div>
      <div className="overflow-x-auto">
        <table className="w-full text-lg border border-collapse min-w-max">
          <thead className="bg-gray-100 text-gray-700 text-center">
            {/* Header Row 1 */}
            <tr>
              <th className="border p-3" rowSpan={3}>
                งานย่อย
              </th>
              {unionYears.map((year) => (
                <th key={year} className="border p-3" colSpan={7}>
                  ปี {year}
                </th>
              ))}
              <th className="border p-3" rowSpan={3}>
                รวมดำเนินการทุกปี
              </th>
              <th className="border p-3" rowSpan={3}>
                รวมเป้าหมายเบิกจ่ายทุกปี
              </th>
            </tr>
            {/* Header Row 2 */}
            <tr>
              {unionYears.map((year) => (
                <React.Fragment key={`year-${year}`}>
                  <th className="border p-3" colSpan={3}>
                    วงเงินดำเนินการ
                  </th>
                  <th className="border p-3" colSpan={3}>
                    เป้าหมายเบิกจ่าย
                  </th>
                  <th className="border p-3" rowSpan={2}>
                    ตัดทิ้ง
                  </th>
                </React.Fragment>
              ))}
            </tr>
            {/* Header Row 3 */}
            <tr>
              {unionYears.map((year) => (
                <React.Fragment key={`subhead-${year}`}>
                  <th className="border p-3" style={{ width: "120px" }}>ผูกพัน</th>
                  <th className="border p-3" style={{ width: "120px" }}>ลงทุน</th>
                  <th className="border p-3" style={{ width: "120px" }}>รวม</th>
                  <th className="border p-3" style={{ width: "120px" }}>ผูกพัน</th>
                  <th className="border p-3" style={{ width: "120px" }}>ลงทุน</th>
                  <th className="border p-3" style={{ width: "120px" }}>รวม</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* --- Rows for each subtask --- */}
            {subtaskSummaries.map((summary) => {
              const overallOperation = unionYears.reduce(
                (acc, year) => acc + summary.tableData[year].operationTotal,
                0
              );
              const overallTarget = unionYears.reduce(
                (acc, year) => acc + summary.tableData[year].targetTotal,
                0
              );
              return (
                <tr key={summary.draftSubtaskId}>
                  <td className="border p-3 text-left">{summary.subtaskName}</td>
                  {unionYears.map((year) => {
                    const data = summary.tableData[year];
                    return (
                      <React.Fragment key={`data-${year}`}>
                        <td className="border p-3 text-right">{formatNumber(data.operationCommit)}</td>
                        <td className="border p-3 text-right">{formatNumber(data.operationInvest)}</td>
                        <td className="border p-3 text-right font-bold">{formatNumber(data.operationTotal)}</td>
                        <td className="border p-3 text-right">{formatNumber(data.targetCommit)}</td>
                        <td className="border p-3 text-right">{formatNumber(data.targetInvest)}</td>
                        <td className="border p-3 text-right font-bold">{formatNumber(data.targetTotal)}</td>
                        <td className="border p-3 text-right">{formatNumber(data.cut)}</td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border p-3 text-right font-bold">{formatNumber(overallOperation)}</td>
                  <td className="border p-3 text-right font-bold">{formatNumber(overallTarget)}</td>
                </tr>
              );
            })}
            {/* --- Overall Summary Row for all subtasks --- */}
            <tr className="bg-gray-100 font-semibold">
              <td className="border p-3 text-center">รวมทุกงานย่อย</td>
              {unionYears.map((year) => {
                const data = overallUnionTotals[year];
                return (
                  <React.Fragment key={`overall-${year}`}>
                    <td className="border p-3 text-right">{formatNumber(data.operationCommit)}</td>
                    <td className="border p-3 text-right">{formatNumber(data.operationInvest)}</td>
                    <td className="border p-3 text-right font-bold">{formatNumber(data.operationTotal)}</td>
                    <td className="border p-3 text-right">{formatNumber(data.targetCommit)}</td>
                    <td className="border p-3 text-right">{formatNumber(data.targetInvest)}</td>
                    <td className="border p-3 text-right font-bold">{formatNumber(data.targetTotal)}</td>
                    <td className="border p-3 text-right">{formatNumber(data.cut)}</td>
                  </React.Fragment>
                );
              })}
              <td className="border p-3 text-right font-bold">{formatNumber(overallGrandTotals.operationTotal)}</td>
              <td className="border p-3 text-right font-bold">{formatNumber(overallGrandTotals.targetTotal)}</td>
            </tr>

            {/* --- Admin Input Rows --- */}
            {renderFundRow("เงินกู้ (Admin กรอก)", "loan")}
            {renderFundRow("เงินรายได้ (Admin กรอก)", "revenue")}
            {renderSumFundRow()}
          </tbody>
        </table>
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            เช็ครายละเอียดส่วนอื่่น
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            approve
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            reject
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            คัดลอกไป 9 ช่อง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmApprovePage;
