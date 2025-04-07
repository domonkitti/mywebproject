import React, { useState } from "react";
import { createProject } from "../../apis/UserProjectApi";

export default function SimpleProjectForm() {
  // State สำหรับเก็บค่าฟิลด์ทั้งหมด
  const [formData, setFormData] = useState({
    projectName: "",
    department: "",
    owner: "",
    type: "",
    subtype: "",
    startDate: "",
    endDate: "",
    budget: "",
  });

  // จัดการ event เปลี่ยนค่า input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ฟังก์ชันส่งข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data (Raw): ", formData);

    // สร้าง payload ให้คีย์ตรงกับฝั่ง Go
    // ถ้าต้องการห่อเป็น {"data": {...}} ก็สามารถทำได้เช่น
    // const payload = { data: { ... } }
    // แต่สมมติว่าเราจะส่งตรง ๆ เลย
    const payload = {
      // ถ้ามี auto-generate ID ก็ส่งเป็น 0 หรือไม่ส่งเลยก็ได้
      project_id: 0,
      project_name: formData.projectName,
      // หรือกำหนดสถานะเป็น "pending" ได้ตั้งแต่ฝั่ง Frontend ถ้าต้องการ
      status: "pending",
      start_date: formData.startDate,
      end_date: formData.endDate,
      type: formData.type,
      subtype: formData.subtype,
      owner: formData.owner,
      // แปลงเป็นตัวเลข (int) ถ้า backend เก็บเป็น int
      budget: Number(formData.budget),
    };

    try {
      console.log("Payload to API:", payload);
      const result = await createProject(payload); // เรียก API
      console.log("API response:", result);
      alert("ฟอร์มถูกส่งเรียบร้อยแล้ว!");

    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-300 rounded-md shadow-sm">
      <h2 className="text-xl font-bold mb-4">ฟอร์มกรอกข้อมูลโครงการ</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* ชื่อโครงการ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ชื่อโครงการ
          </label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* หน่วยงาน */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            หน่วยงาน
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* เจ้าของโครงการ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            เจ้าของโครงการ
          </label>
          <input
            type="text"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* ประเภท */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ประเภทโครงการ
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={(e) => {
              handleChange(e);
              // ถ้าต้องการเคลียร์ subtype เมื่อ type เปลี่ยน
              setFormData((prev) => ({ ...prev, subtype: "" }));
            }}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- เลือกประเภทโครงการ --</option>
            <option value="งาน">งาน</option>
            <option value="แผนงาน">แผนงาน</option>
            <option value="เปลี่ยนแปลงงบประมาณ">เปลี่ยนแปลงงบประมาณ</option>
            <option value="โครงการ">โครงการ</option>
          </select>
        </div>

        {/* Subtype: แสดงเฉพาะเมื่อเลือก "งาน" */}
        {formData.type === "งาน" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ประเภทของงาน
            </label>
            <select
              name="subtype"
              value={formData.subtype}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            >
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

        {/* วันที่เริ่มต้น / วันที่สิ้นสุด */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
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
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* ปุ่ม Submit */}
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
