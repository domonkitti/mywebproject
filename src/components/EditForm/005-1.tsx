import React, { useState } from "react";
import { FormRow } from "../../interfaces/MainInterface";

export default function Form005_1() {
  const [rows, setRows] = useState<FormRow[]>([]);

  const handleChange = (
    index: number,
    field: keyof FormRow,
    value: string
  ) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        name: "",
        landSize: "",
        landAmount: "",
        landReason: "",
        improveSize: "",
        improveAmount: "",
        improveReason: "",
      },
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 border border-gray-400 rounded-md bg-white">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">แบบฟอร์ม 005-1</h1>
        <h2 className="text-lg">หมวดที่ดิน</h2>

      </div>

      {/* ปุ่มเพิ่มรายการ */}
      <div className="flex justify-end mb-2">
        <button
          onClick={addRow}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + เพิ่มรายการ
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border border-gray-400 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th rowSpan={2} className="border border-gray-400 px-2 py-1 ">ที่</th>
              <th rowSpan={2} className="border border-gray-400 px-2 py-1 w-1000">ชื่อการไฟฟ้า</th>
              <th colSpan={3} className="border border-gray-400 px-2 py-1">ชื่อที่ดิน</th>
              <th colSpan={3} className="border border-gray-400 px-2 py-1">ปรับปรุงที่ดิน</th>
            </tr>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-2 py-1">จำนวน (ไร่)</th>
              <th className="border border-gray-400 px-2 py-1">จำนวนเงิน (บาท)</th>
              <th className="border border-gray-400 px-2 py-1">วัตถุประสงค์ / เหตุผล</th>
              <th className="border border-gray-400 px-2 py-1">จำนวน(ตารางเมตร)</th>
              <th className="border border-gray-400 px-2 py-1">จำนวนเงิน (บาท)</th>
              <th className="border border-gray-400 px-2 py-1">วัตถุประสงค์ / เหตุผล</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-400 px-2 py-1">{index + 1}</td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.landSize}
                    onChange={(e) => handleChange(index, "landSize", e.target.value)}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.landAmount}
                    onChange={(e) => handleChange(index, "landAmount", e.target.value)}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.landReason}
                    onChange={(e) => handleChange(index, "landReason", e.target.value)}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.improveSize}
                    onChange={(e) => handleChange(index, "improveSize", e.target.value)}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.improveAmount}
                    onChange={(e) => handleChange(index, "improveAmount", e.target.value)}
                    className="w-full border rounded p-1"
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.improveReason}
                    onChange={(e) => handleChange(index, "improveReason", e.target.value)}
                    className="w-full border rounded p-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
