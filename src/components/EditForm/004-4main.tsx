import { useState } from "react";
import Form004_4details from "./004-4detail";


export default function Form004_4main () {
  const [years, setYears] = useState<number[]>([2568, 2569, 2570, 2571]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const addYear = () => {
    const nextYear = Math.max(...years) + 1;
    setYears([...years, nextYear]);
  };

  const removeYear = (year: number) => {
    setYears(years.filter(y => y !== year));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ตั้งงบประมาณรายปี</h2>

      {/* ตารางเลือกปี */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2 text-center">ปีงบประมาณ</th>
              <th className="border border-gray-400 px-4 py-2 text-center">ดำเนินการ</th>
              <th className="border border-gray-400 px-4 py-2 text-center">เป้าหมายการเบิกจ่าย</th>
              <th className="border border-gray-400 px-4 py-2 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {years.map(year => (
              <tr key={year}>
                <td className="border border-gray-400 px-4 py-2 text-center">{year}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">--</td>
                <td className="border border-gray-400 px-4 py-2 text-center">--</td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  <button onClick={() => setSelectedYear(year)} className="p-1 bg-blue-500 text-white rounded mr-2">
                    ✏️ แก้ไข
                  </button>
                  <button onClick={() => removeYear(year)} className="p-1 bg-red-500 text-white rounded">
                    🗑️ ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ปุ่มเพิ่มปี */}
      <button onClick={addYear} className="mt-4 p-2 bg-green-500 text-white rounded">➕ เพิ่มปี</button>

      {/* เปิดหน้าแก้ไขงบประมาณใน Pop-up */}
      {selectedYear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-4/5 h-4/5 overflow-auto">
            <button onClick={() => setSelectedYear(null)} className="p-2 bg-red-500 text-white rounded mb-4">
              ❌ ปิด
            </button>
            <Form004_4details selectedYear={selectedYear} />
          </div>
        </div>
      )}
    </div>
  );
}
