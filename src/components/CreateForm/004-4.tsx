import { useState, useEffect } from "react";

export default function Form004_4() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [details, setDetails] = useState<{ [key: string]: string }>({});
  const [amounts, setAmounts] = useState<{ [key: string]: number[] }>({});

  const openModal = (category: string) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const saveDetails = () => {
    setDetails((prev) => ({
      ...prev,
      [selectedCategory]: document.getElementById("detail-input")?.value || "",
    }));
    setIsModalOpen(false);
  };

  useEffect(() => {
    const sumYears = (keys: string[]) => {
      return keys.reduce((acc, key) => {
        if (amounts[key]) {
          return acc.map((val, index) => val + (amounts[key][index] || 0));
        }
        return acc;
      }, [0, 0, 0, 0, 0]);
    };

    setAmounts((prev) => ({
      ...prev,
      "2.2 งานระบบไฟฟ้า": sumYears([
        "  - ค่าที่ดินอุปกรณ์ (งป.007)",
        "  - ค่าจ้างแรงงาน",
        "  - ค่าขนส่ง",
        "  - ค่าดำเนินการ",
        "  - ค่าตรวจสอบและควบคุมงาน",
        "  - ค่าดำเนินคดี",
        "  - อื่น ๆ"
      ]),
      "2. หมวดสิ่งก่อสร้าง": sumYears(["2.1 งานโยธา (งป.006)", "2.2 งานระบบไฟฟ้า"]),
      "รวมทั้งสิ้น": sumYears([
        "1. หมวดที่ดิน (งป.005)",
        "2. หมวดสิ่งก่อสร้าง",
        "3. หมวดค่าครุภัณฑ์ (งป.008)",
        "4. หมวดค่าซ่อมบำรุง (งป.008)",
        "5. หมวดเครื่องมือ เครื่องใช้ขนาดเล็ก (งป.008)",
        "6. หมวดวิจัยและพัฒนา (งป.008)",
        "7. หมวดอื่น ๆ (งป.008)"
      ])
    }));
  }, [amounts]);

  const handleInputChange = (label: string, yearIndex: number, value: string) => {
    setAmounts((prev) => ({
      ...prev,
      [label]: prev[label] ? prev[label].map((v, i) => (i === yearIndex ? parseFloat(value) || 0 : v)) :
        [0, 0, 0, 0, 0].map((v, i) => (i === yearIndex ? parseFloat(value) || 0 : v))
    }));
  };

  const rows = [
    { label: "1. หมวดที่ดิน (งป.005)" },
    { label: "2. หมวดสิ่งก่อสร้าง" },
    { label: "2.1 งานโยธา (งป.006)", indent: 2 },
    { label: "2.2 งานระบบไฟฟ้า", indent: 2 },
    { label: "  - ค่าที่ดินอุปกรณ์ (งป.007)", indent: 3 },
    { label: "  - ค่าจ้างแรงงาน", indent: 3 },
    { label: "  - ค่าขนส่ง", indent: 3 },
    { label: "  - ค่าดำเนินการ", indent: 3 },
    { label: "  - ค่าตรวจสอบและควบคุมงาน", indent: 3 },
    { label: "  - ค่าดำเนินคดี", indent: 3 },
    { label: "  - อื่น ๆ", indent: 3 },
    { label: "รวมหมวดสิ่งก่อสร้าง", isSummary: true },
    { label: "3. หมวดค่าครุภัณฑ์ (งป.008)" },
    { label: "4. หมวดค่าซ่อมบำรุง (งป.008)" },
    { label: "5. หมวดเครื่องมือ เครื่องใช้ขนาดเล็ก (งป.008)" },
    { label: "6. หมวดวิจัยและพัฒนา (งป.008)" },
    { label: "7. หมวดอื่น ๆ (งป.008)" },
    { label: "รวมทั้งสิ้น", isSummary: true },
  ];

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th rowSpan={2} className="border border-gray-400 px-4 py-2 text-center">รายการ</th>
            <th rowSpan={2} className="border border-gray-400 px-4 py-2 text-center">วงเงินดำเนินการ ปี 2569</th>
            <th colSpan={3} className="border border-gray-400 px-4 py-2 text-center">เป้าหมายการเบิกจ่าย (รายปี)</th>
            <th rowSpan={2} className="border border-gray-400 px-4 py-2 text-center">รวม</th>
          </tr>
          <tr className="bg-gray-200">
            {[...Array(3)].map((_, i) => (
              <th key={i} className="border border-gray-400 px-4 py-2 text-center">{2569 + i}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={row.isSummary ? "bg-gray-100 font-semibold" : ""}>
              <td className={`border border-gray-400 px-4 py-2 cursor-pointer ${row.indent ? `pl-${row.indent * 4}` : ""} hover:bg-blue-100`} onClick={() => openModal(row.label)}>
                {row.label} {details[row.label] && `✅`}
              </td>
              {[...Array(4)].map((_, i) => (
                <td key={i} className="border border-gray-400 px-4 py-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="..."
                    value={amounts[row.label]?.[i] || ""}
                    onChange={(e) => handleInputChange(row.label, i, e.target.value)}
                    disabled={row.isSummary}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
