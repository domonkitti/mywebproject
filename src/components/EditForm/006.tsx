import React, { useState } from "react";

const months = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

const steps = [
  "อนุมัติหลักการ / อนุมัติสเปค",
  "การดำเนินการจัดซื้อจัดจ้าง",
  "จัดทำเอกสารประกวดราคา/สอบราคา",
  "ประกวดราคา /สอบราคา",
  "อนุมัติจัดซื้อ / จัดจ้าง",
  "ทำสัญญา",
  "ส่งของ / ดำเนินการก่อสร้าง",
  "ตรวจรับและทดสอบ",
  "เบิกจ่ายเงิน(ล้านบาท)"
];

export default function Form006() {
  const [tables, setTables] = useState<string[]>(["ปีงบประมาณ 2569"]);
  const [chartData, setChartData] = useState<{ [year: string]: { [key: string]: (boolean | string)[] } }>(() => {
    const initial: { [year: string]: { [key: string]: (boolean | string)[] } } = {
      "ปีงบประมาณ 2569": {}
    };
    steps.forEach((step) => {
      initial["ปีงบประมาณ 2569"][step] = Array(months.length).fill(step === "เบิกจ่ายเงิน(ล้านบาท)" ? "" : false);
    });
    return initial;
  });

  const addTable = () => {
    const nextYear = 2569 + tables.length;
    const yearLabel = `ปีงบประมาณ ${nextYear}`;
    setTables((prev) => [...prev, yearLabel]);
    setChartData((prev) => {
      const newChart = { ...prev };
      newChart[yearLabel] = {};
      steps.forEach((step) => {
        newChart[yearLabel][step] = Array(months.length).fill(step === "เบิกจ่ายเงิน(ล้านบาท)" ? "" : false);
      });
      return newChart;
    });
  };

  const toggleCell = (year: string, step: string, monthIndex: number, value: string | boolean) => {
    setChartData((prev) => {
      const updated = { ...prev };
      const row = [...updated[year][step]];
      row[monthIndex] = value;
      updated[year][step] = row;
      return updated;
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Form006 - Gantt Chart แสดงแผนการดำเนินงานรายเดือน</h2>
      <button
        onClick={addTable}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + เพิ่มปีงบประมาณ
      </button>

      {tables.map((year, tableIndex) => (
        <div key={tableIndex} className="mb-10">
          <h3 className="text-lg font-semibold mb-2">{year}</h3>
          <div className="overflow-x-auto border border-gray-300 rounded-md">
            <div className="grid grid-cols-[280px_repeat(12,_1fr)] text-sm font-medium">
              {/* Header */}
              <div className="bg-gray-100 border-r border-b border-gray-300 px-2 py-1">กิจกรรม</div>
              {months.map((month, index) => (
                <div
                  key={index}
                  className="bg-gray-100 border-r border-b border-gray-300 text-center"
                >
                  {month}
                </div>
              ))}

              {/* Rows */}
              {steps.map((step, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className="border-r border-b border-gray-300 px-2 py-1 whitespace-nowrap">
                    {step}
                  </div>
                  {months.map((_, colIndex) => (
                    <div key={colIndex} className="border-r border-b border-gray-300 h-8">
                      {step === "เบิกจ่ายเงิน(ล้านบาท)" ? (
                        <input
                          type="text" inputMode="decimal" pattern="[0-9]*"
                          className="w-full h-full text-center outline-none"
                          value={chartData[year][step][colIndex] as string}
                          onChange={(e) => toggleCell(year, step, colIndex, e.target.value)}
                        />
                      ) : (
                        <div
                          onClick={() => toggleCell(year, step, colIndex, !chartData[year][step][colIndex])}
                          className={`h-full w-full cursor-pointer ${
                            chartData[year][step][colIndex] ? "bg-green-500" : "hover:bg-green-100"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
