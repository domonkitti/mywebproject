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
  const [chart, setChart] = useState<{ [key: string]: boolean[] }>(() => {
    const initial: { [key: string]: boolean[] } = {};
    steps.forEach((step) => {
      initial[step] = Array(months.length).fill(false);
    });
    return initial;
  });

  const toggleCell = (step: string, monthIndex: number) => {
    setChart((prev) => ({
      ...prev,
      [step]: prev[step].map((val, i) => (i === monthIndex ? !val : val)),
    }));
  };

  return (
    
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Form006 - Gantt Chart แสดงแผนการดำเนินงานรายเดือน</h2>
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
                <div
                  key={colIndex}
                  onClick={() => toggleCell(step, colIndex)}
                  className={`border-r border-b border-gray-300 h-8 cursor-pointer ${
                    chart[step][colIndex] ? "bg-green-500" : "hover:bg-green-100"
                  }`}
                ></div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
