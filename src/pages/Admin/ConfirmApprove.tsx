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

  const renderFundRow = (label: string, fundType: "loan" | "revenue") => {
    const previousBalances: number[] = [];
    return (
      <tr>
        <td className="border p-2 text-center font-bold">{label}</td>
        {unionYears.map((year, i) => {
          const fundData = getFundData(year, fundType);
          const requestCommit = calcRequestCommit(i, previousBalances);
          const sumReq = requestCommit + fundData.requestInvest;
          const sumPay = fundData.payCommit + fundData.payInvest;
          const balance = sumReq - sumPay - fundData.cut;
          previousBalances.push(balance);
          return (
            <React.Fragment key={year}>
              <td className="border p-2 text-right">{formatNumber(requestCommit)}</td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  className="border p-1 w-full text-right"
                  value={fundData.requestInvest || ""}
                  onChange={(e) => handleFundInputChange(year, fundType, "requestInvest", e.target.value)}
                />
              </td>
              <td className="border p-2 text-right font-bold">{formatNumber(sumReq)}</td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  className="border p-1 w-full text-right"
                  value={fundData.payCommit || ""}
                  onChange={(e) => handleFundInputChange(year, fundType, "payCommit", e.target.value)}
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  className="border p-1 w-full text-right"
                  value={fundData.payInvest || ""}
                  onChange={(e) => handleFundInputChange(year, fundType, "payInvest", e.target.value)}
                />
              </td>
              <td className="border p-2 text-right font-bold">{formatNumber(sumPay)}</td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  className="border p-1 w-full text-right"
                  value={fundData.cut || ""}
                  onChange={(e) => handleFundInputChange(year, fundType, "cut", e.target.value)}
                />
              </td>
            </React.Fragment>
          );
        })}
        <td className="border p-2 text-right"></td>
        <td className="border p-2 text-right"></td>
      </tr>
    );
  };

  const renderSumFundRow = () => {
    return (
      <tr className="bg-gray-50 font-semibold">
        <td className="border p-2 text-center">รวมเงิน</td>
        {unionYears.map((year, i) => {
          const loanData = getFundData(year, "loan");
          const revenueData = getFundData(year, "revenue");
          const reqCommit = calcRequestCommit(i, []) + 0; // For simplicity, admin rows do not chain across fund types here.
          const reqInvest = loanData.requestInvest + revenueData.requestInvest;
          const sumReq = reqCommit + reqInvest;
          const payCommit = loanData.payCommit + revenueData.payCommit;
          const payInvest = loanData.payInvest + revenueData.payInvest;
          const sumPay = payCommit + payInvest;
          const cut = loanData.cut + revenueData.cut;
          return (
            <React.Fragment key={year}>
              <td className="border p-2 text-right">{formatNumber(reqCommit)}</td>
              <td className="border p-2 text-right">{formatNumber(reqInvest)}</td>
              <td className="border p-2 text-right font-bold">{formatNumber(sumReq)}</td>
              <td className="border p-2 text-right">{formatNumber(payCommit)}</td>
              <td className="border p-2 text-right">{formatNumber(payInvest)}</td>
              <td className="border p-2 text-right font-bold">{formatNumber(sumPay)}</td>
              <td className="border p-2 text-right">{formatNumber(cut)}</td>
            </React.Fragment>
          );
        })}
        <td className="border p-2 text-right"></td>
        <td className="border p-2 text-right"></td>
      </tr>
    );
  };

  if (loading) return <p className="text-center">กำลังโหลดข้อมูล...</p>;
  if (subtaskSummaries.length === 0)
    return <p className="text-center text-gray-500">ไม่มีข้อมูล</p>;

  // Total number of columns:
  // First column for subtask name + (7 columns for each year) + 2 extra overall columns
  const totalCols = 1 + unionYears.length * 7 + 2;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">รายละเอียดโครงการ</h2>
      <div className="overflow-auto">
        <table className="w-full text-sm border border-collapse min-w-max">
          <thead className="bg-gray-100 text-gray-700 text-center">
            {/* Header Row 1 */}
            <tr>
              <th className="border p-2" rowSpan={3}>
                งานย่อย
              </th>
              {unionYears.map((year) => (
                <th key={year} className="border p-2" colSpan={7}>
                  ปี {year}
                </th>
              ))}
              <th className="border p-2" rowSpan={3}>
                รวมดำเนินการทุกปี
              </th>
              <th className="border p-2" rowSpan={3}>
                รวมเป้าหมายเบิกจ่ายทุกปี
              </th>
            </tr>
            {/* Header Row 2 */}
            <tr>
              {unionYears.map((year) => (
                <React.Fragment key={`year-${year}`}>
                  <th className="border p-2" colSpan={3}>
                    วงเงินดำเนินการ
                  </th>
                  <th className="border p-2" colSpan={3}>
                    เป้าหมายเบิกจ่าย
                  </th>
                  <th className="border p-2" rowSpan={2}>
                    ตัดทิ้ง
                  </th>
                </React.Fragment>
              ))}
            </tr>
            {/* Header Row 3 */}
            <tr>
              {unionYears.map((year) => (
                <React.Fragment key={`subhead-${year}`}>
                  <th className="border p-2">ผูกพัน</th>
                  <th className="border p-2">ลงทุน</th>
                  <th className="border p-2">รวม</th>
                  <th className="border p-2">ผูกพัน</th>
                  <th className="border p-2">ลงทุน</th>
                  <th className="border p-2">รวม</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* --- Rows for each subtask --- */}
            {subtaskSummaries.map((summary) => {
              const totals = calcTotals(summary.tableData, unionYears);
              // Compute overall sums for this subtask:
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
                  <td className="border p-2 text-left">{summary.subtaskName}</td>
                  {unionYears.map((year) => {
                    const data = summary.tableData[year];
                    return (
                      <React.Fragment key={`data-${year}`}>
                        <td className="border p-2 text-right">{formatNumber(data.operationCommit)}</td>
                        <td className="border p-2 text-right">{formatNumber(data.operationInvest)}</td>
                        <td className="border p-2 text-right font-bold">{formatNumber(data.operationTotal)}</td>
                        <td className="border p-2 text-right">{formatNumber(data.targetCommit)}</td>
                        <td className="border p-2 text-right">{formatNumber(data.targetInvest)}</td>
                        <td className="border p-2 text-right font-bold">{formatNumber(data.targetTotal)}</td>
                        <td className="border p-2 text-right">{formatNumber(data.cut)}</td>
                      </React.Fragment>
                    );
                  })}
                  <td className="border p-2 text-right font-bold">
                    {formatNumber(overallOperation)}
                  </td>
                  <td className="border p-2 text-right font-bold">
                    {formatNumber(overallTarget)}
                  </td>
                </tr>
              );
            })}
            {/* --- Overall Summary Row for all subtasks --- */}
            <tr className="bg-gray-100 font-semibold">
              <td className="border p-2 text-center">รวมทุกงานย่อย</td>
              {unionYears.map((year) => {
                const data = overallUnionTotals[year];
                return (
                  <React.Fragment key={`overall-${year}`}>
                    <td className="border p-2 text-right">{formatNumber(data.operationCommit)}</td>
                    <td className="border p-2 text-right">{formatNumber(data.operationInvest)}</td>
                    <td className="border p-2 text-right font-bold">{formatNumber(data.operationTotal)}</td>
                    <td className="border p-2 text-right">{formatNumber(data.targetCommit)}</td>
                    <td className="border p-2 text-right">{formatNumber(data.targetInvest)}</td>
                    <td className="border p-2 text-right font-bold">{formatNumber(data.targetTotal)}</td>
                    <td className="border p-2 text-right">{formatNumber(data.cut)}</td>
                  </React.Fragment>
                );
              })}
              <td className="border p-2 text-right font-bold">
                {formatNumber(overallGrandTotals.operationTotal)}
              </td>
              <td className="border p-2 text-right font-bold">
                {formatNumber(overallGrandTotals.targetTotal)}
              </td>
            </tr>

            {/* --- Admin Input Rows --- */}
            {renderFundRow("เงินกู้ (Admin กรอก)", "loan")}
            {renderFundRow("เงินรายได้ (Admin กรอก)", "revenue")}
            {renderSumFundRow()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfirmApprovePage;
