import React from "react";

export default function SimpleProjectForm() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-300 rounded-md shadow-sm">
      <h2 className="text-xl font-bold mb-4">ฟอร์มกรอกข้อมูลโครงการ</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ชื่อโครงการ</label>
          <input type="text" className="mt-1 w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">หน่วยงาน</label>
          <input type="text" className="mt-1 w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ประเภท</label>
          <select className="mt-1 w-full border border-gray-300 rounded px-3 py-2">
            <option value="">-- เลือกประเภท --</option>
            <option value="งาน">งาน</option>
            <option value="แผนงาน">แผนงาน</option>
            <option value="เปลี่ยนแปลงงบประมาณ">เปลี่ยนแปลงงบประมาณ</option>
            <option value="โครงการ">โครงการ</option>
          </select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">วันที่เริ่มต้น</label>
            <input type="date" className="mt-1 w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">วันที่สิ้นสุด</label>
            <input type="date" className="mt-1 w-full border border-gray-300 rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">งบประมาณ (บาท)</label>
          <input type="number" className="mt-1 w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div className="text-right">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}