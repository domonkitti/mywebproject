import React, { useState } from "react";

export default function SimpleProjectForm() {
  // State to track the selected "ประเภท"
  const [projectType, setProjectType] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: submit or process form data
    alert("ฟอร์มถูกส่งเรียบร้อยแล้ว!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-300 rounded-md shadow-sm">
      <h2 className="text-xl font-bold mb-4">ฟอร์มกรอกข้อมูลโครงการ</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* ชื่อโครงการ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ชื่อโครงการ</label>
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* หน่วยงาน */}
        <div>
          <label className="block text-sm font-medium text-gray-700">หน่วยงาน</label>
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* ประเภท */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ประเภท</label>
          <select
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
          >
            <option value="">-- เลือกประเภท --</option>
            <option value="งาน">งาน</option>
            <option value="แผนงาน">แผนงาน</option>
            <option value="เปลี่ยนแปลงงบประมาณ">เปลี่ยนแปลงงบประมาณ</option>
            <option value="โครงการ">โครงการ</option>
          </select>
        </div>

        {/* งาน */}
        {projectType === "งาน" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ประเภทของงาน
            </label>
            <select className="mt-1 w-full border border-gray-300 rounded px-3 py-2">
              <option value="">-- เลือกประเภทของงาน --</option>
              <option value="หมวดสิ่งก่อสร้าง">หมวดสิ่งก่อสร้าง</option>
              <option value="หมวดเครื่องจักรอุปกรณ์">หมวดเครื่องจักรอุปกรณ์</option>
              <option value="หมวดเครื่องใช้สำนักงานและเครื่องมือเครื่องใช้ขนาดเล็ก">
                หมวดเครื่องใช้สำนักงานและเครื่องมือเครื่องใช้ขนาดเล็ก
              </option>
              <option value="หมวดวิจัยและพัฒนา">หมวดวิจัยและพัฒนา</option>
              <option value="หมวดลงทุนอื่นๆ">หมวดลงทุนอื่นๆ</option>
            </select>
          </div>
        )}
          {/* ปปงบ */}
          {/* {projectType === "เปลี่ยนแปลงงบประมาณ" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ประเภทของงาน
            </label>
            <select className="mt-1 w-full border border-gray-300 rounded px-3 py-2">
              <option value="">-- เลือกประเภทของงาน --</option>
              <option value="หมวดสิ่งก่อสร้าง">หมวดสิ่งก่อสร้าง</option>
              <option value="หมวดเครื่องจักรอุปกรณ์">หมวดเครื่องจักรอุปกรณ์</option>
              <option value="หมวดเครื่องใช้สำนักงานและเครื่องมือเครื่องใช้ขนาดเล็ก">
                หมวดเครื่องใช้สำนักงานและเครื่องมือเครื่องใช้ขนาดเล็ก
              </option>
              <option value="หมวดวิจัยและพัฒนา">หมวดวิจัยและพัฒนา</option>
              <option value="หมวดลงทุนอื่นๆ">หมวดลงทุนอื่นๆ</option>
            </select>
          </div>
        )} */}

        {/* วันที่เริ่มต้น / วันที่สิ้นสุด */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">วันที่เริ่มต้น</label>
            <input
              type="date"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">วันที่สิ้นสุด</label>
            <input
              type="date"
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* งบประมาณ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            งบประมาณ (บาท)
          </label>
          <input
            type="number"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
