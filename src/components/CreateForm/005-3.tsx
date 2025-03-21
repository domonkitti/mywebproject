import React, { useState } from "react";
import { FormRow } from "../../interfaces/MainInterface";

export default function Form005_3() {
  const [rows, setRows] = useState<FormRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormRow>({
    name: "",
    item: "",
    size: "",
    amount: "",
    reason: "",
  });

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", item: "", size: "", amount: "", reason: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addRow = () => {
    setRows((prev) => [...prev, formData]);
    closeModal();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 border border-gray-400 rounded-md bg-white">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">แบบฟอร์ม005-3</h1>
        <h2 className="text-lg">หมวดสิ่งก่อสร้าง</h2>
        <h3 className="text-lg">งานโยธา</h3>
      </div>

      {/* ปุ่มเพิ่มรายการ */}
      <div className="flex justify-end mb-2">
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + เพิ่มรายการ
        </button>
      </div>

      {/* ตารางรายการ */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2 text-center w-12">ที่</th>
              <th className="border border-gray-400 px-4 py-2 text-center">ชื่อการไฟฟ้า</th>
              <th className="border border-gray-400 px-4 py-2 text-center">รายการ</th>
              <th className="border border-gray-400 px-4 py-2 text-center w-24">ขนาด</th>
              <th className="border border-gray-400 px-4 py-2 text-center w-32">จำนวนเงิน (บาท)</th>
              <th className="border border-gray-400 px-4 py-2 text-center">วัตถุประสงค์ / เหตุผล</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-400 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-400 px-4 py-2">{row.name}</td>
                <td className="border border-gray-400 px-4 py-2">{row.item}</td>
                <td className="border border-gray-400 px-4 py-2">{row.size}</td>
                <td className="border border-gray-400 px-4 py-2">{row.amount}</td>
                <td className="border border-gray-400 px-4 py-2">{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal เพิ่มข้อมูล */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">เพิ่มรายการ</h2>
            <div className="space-y-2">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="ชื่อการไฟฟ้า"
              />
              <input
                name="item"
                value={formData.item}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="รายการ"
              />
              <input
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="ขนาด"
              />
              <input
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="จำนวนเงิน (บาท)"
              />
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="วัตถุประสงค์ / เหตุผล"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                ยกเลิก
              </button>
              <button
                onClick={addRow}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
