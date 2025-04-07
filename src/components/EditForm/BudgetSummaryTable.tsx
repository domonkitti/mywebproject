import React, { useEffect, useState } from "react";

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
  operationCommit: number; // คอลัมน์ 1
  operationInvest: number; // คอลัมน์ 2
  operationTotal: number; // คอลัมน์ 3
  targetCommit: number; // คอลัมน์ 4
  targetInvest: number; // คอลัมน์ 5
  targetTotal: number; // คอลัมน์ 6
  cut: number; // คอลัมน์ 7 (ไม่ใช้งานตอนนี้ เอาไว้อนาคต)
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

interface Props {
  projectId: number;
}

const formatNumber = (num: number) => (num > 0 ? num.toLocaleString() : "-");

const BudgetSummaryBySubtask: React.FC<Props> = ({ projectId }) => {
  const [loading, setLoading] = useState(true);
  const [subtaskSummaries, setSubtaskSummaries] = useState<SubtaskSummary[]>([]);
  const [unionYears, setUnionYears] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:2024/projects/getbudgetrequestsbyproject/${projectId}`
        );
        const result: BudgetData[] = await res.json();

        // Group ข้อมูลตาม draftSubtaskId
        const subtaskMap: Record<number, BudgetData[]> = {};
        result.forEach((item) => {
          if (!subtaskMap[item.draftSubtaskId]) {
            subtaskMap[item.draftSubtaskId] = [];
          }
          subtaskMap[item.draftSubtaskId].push(item);
        });

        const summaries: SubtaskSummary[] = [];

        // คำนวณข้อมูลสำหรับแต่ละงานย่อย
        Object.keys(subtaskMap).forEach((key) => {
          const group = subtaskMap[Number(key)];
          // ดึงปีที่เกี่ยวข้องในงานย่อยนั้น
          const yearSet = new Set<number>();
          group.forEach((item) => yearSet.add(item.year));
          const sortedYears = Array.from(yearSet).sort();

          // เตรียม data structure เริ่มต้นสำหรับปีที่มีในงานย่อยนั้น
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

          // รวมข้อมูลจากแต่ละรายการในงานย่อยนั้น
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

          // คำนวณรวมในแต่ละปี (เฉพาะปีที่มีข้อมูล)
          sortedYears.forEach((year) => {
            const data = initialTableData[year];
            data.operationTotal = data.operationCommit + data.operationInvest;
            data.targetTotal = data.targetCommit + data.targetInvest;
          });

          // ทำ cross-year สำหรับปีที่มีข้อมูลในกลุ่มนี้
          sortedYears.forEach((year, index) => {
            if (index === 0) return;
            const prevYear = sortedYears[index - 1];
            const prevData = initialTableData[prevYear];
            initialTableData[year].operationCommit = prevData.operationTotal - prevData.targetTotal;
            initialTableData[year].operationTotal =
              initialTableData[year].operationCommit + initialTableData[year].operationInvest;
          });

          summaries.push({
            draftSubtaskId: group[0].draftSubtaskId,
            subtaskName: group[0].subtaskName,
            years: sortedYears,
            tableData: initialTableData,
          });
        });

        // สร้าง unionYears จากทุก subtask
        const unionYearSet = new Set<number>();
        summaries.forEach((summary) => {
          summary.years.forEach((year) => unionYearSet.add(year));
        });
        const unionYearsArr = Array.from(unionYearSet).sort();

        // สำหรับแต่ละ subtask ให้อัปเดต tableData ให้ครอบคลุม unionYears ทั้งหมด
        // โดยใช้ค่าเริ่มต้นเป็น 0 หากไม่มีข้อมูล และคำนวณ cross-year ต่อเนื่อง
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
          // คำนวณ cross-year โดยใช้ unionYearsArr ทั้งหมด
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
            newTableData[year].operationTotal =
              newTableData[year].operationCommit + newTableData[year].operationInvest;
            newTableData[year].targetTotal =
              newTableData[year].targetCommit + newTableData[year].targetInvest;
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

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (subtaskSummaries.length === 0)
    return <p className="text-center text-gray-500">ไม่มีข้อมูล</p>;

  // จำนวนคอลัมน์ = 1 (งานย่อย) + (6 * จำนวน unionYears) + 6 (คอลัมน์รวมทั้งสิ้น)
  const totalCols = 1 + unionYears.length * 6 + 6;

  // ฟังก์ชันคำนวณผลรวมของแต่ละ subtask จากทุกปี
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
    });
    return totals;
  };

  // คำนวณผลรวมรวมของงานย่อยทั้งหมด (สำหรับแต่ละปี)
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
    });
    return acc;
  }, {} as TableData);

  // คำนวณผลรวม "รวมทั้งสิ้น" จากงานย่อยทั้งหมด
  const overallGrandTotals = subtaskSummaries.reduce(
    (totals, summary) => {
      const t = calcTotals(summary.tableData, unionYears);
      totals.operationCommit += t.operationCommit;
      totals.operationInvest += t.operationInvest;
      totals.operationTotal += t.operationTotal;
      totals.targetCommit += t.targetCommit;
      totals.targetInvest += t.targetInvest;
      totals.targetTotal += t.targetTotal;
      return totals;
    },
    { operationCommit: 0, operationInvest: 0, operationTotal: 0, targetCommit: 0, targetInvest: 0, targetTotal: 0, cut: 0 }
  );

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">
        สรุปภาพรวมงบประมาณและการเบิกจ่าย (รวมงานย่อยทั้งหมดในตารางเดียว)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-400 min-w-max">
          <thead className="bg-gray-100 text-gray-700 text-center">
            {/* แถวแรก: header ของปี และคอลัมน์ "รวมทั้งสิ้น" */}
            <tr>
              <th className="border p-2" rowSpan={3}>
                งานย่อย
              </th>
              {unionYears.map((year) => (
                <th key={year} className="border p-2" colSpan={6}>
                  ปี {year}
                </th>
              ))}
              <th className="border p-2" colSpan={6}>
                รวมทั้งสิ้น
              </th>
            </tr>
            {/* แถวที่สอง */}
            <tr>
              {unionYears.map((year) => (
                <React.Fragment key={`year-${year}`}>
                  <th className="border p-2" colSpan={3}>
                    วงเงินดำเนินการ
                  </th>
                  <th className="border p-2" colSpan={3}>
                    เป้าหมายเบิกจ่าย
                  </th>
                </React.Fragment>
              ))}
              <React.Fragment>
                <th className="border p-2" colSpan={3}>
                  วงเงินดำเนินการ
                </th>
                <th className="border p-2" colSpan={3}>
                  เป้าหมายเบิกจ่าย
                </th>
              </React.Fragment>
            </tr>
            {/* แถวที่สาม */}
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
              <React.Fragment>

                <th className="border p-2"colSpan={3}>รวม</th>

                <th className="border p-2"colSpan={3}>รวม</th>
              </React.Fragment>
            </tr>
          </thead>
          <tbody>
            {subtaskSummaries.map((summary) => {
              const totals = calcTotals(summary.tableData, unionYears);
              return (
                <React.Fragment key={summary.draftSubtaskId}>
                  {/* แถวสำหรับแสดงข้อมูลของแต่ละปีและคอลัมน์ "รวมทั้งสิ้น" */}
                  <tr>
                    <td className="border p-2 text-center font-bold">{summary.subtaskName}</td>
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
                        </React.Fragment>
                      );
                    })}
                    {/* คอลัมน์ "รวมทั้งสิ้น" สำหรับ subtask นั้น */}
                    <React.Fragment>

                      <td className="border p-2 text-right"colSpan={3}>{formatNumber(totals.operationInvest)}</td>
                      <td className="border p-2 text-right font-bold"colSpan={3}>{formatNumber(totals.targetTotal)}</td>
                    </React.Fragment>
                  </tr>
                </React.Fragment>
              );
            })}
            {/* แถวสรุปผลรวมของงานย่อยทั้งหมด (เช่น "สวัสดี" กับ "เหล็ก") */}
            <tr>
              <td className="border p-2 text-center font-bold bg-gray-300">สรุปทั้งหมด</td>
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
                  </React.Fragment>
                );
              })}
              {/* คอลัมน์ "รวมทั้งสิ้น" สุดท้าย */}
              <React.Fragment>

                <td className="border p-2 text-right"colSpan={3}>{formatNumber(overallGrandTotals.operationInvest)}</td>

                <td className="border p-2 text-right font-bold"colSpan={3}>{formatNumber(overallGrandTotals.targetTotal)}</td>
              </React.Fragment>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetSummaryBySubtask;
