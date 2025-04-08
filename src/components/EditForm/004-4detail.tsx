import { useEffect, useMemo, useState } from "react";
import { getBudgetRequests, saveBudgetRequests } from "../../apis/UserProjectApi";

export default function Form004_4details({
  selectedYear,
  subProjectId,
  onSaveSuccess,
}: {
  selectedYear: number;
  subProjectId: number;
  onSaveSuccess: () => void;
}) {
  const years = useMemo(() => [selectedYear, selectedYear + 1, selectedYear + 2], [selectedYear]);

  const [allocatedAmounts, setAllocatedAmounts] = useState<{ [key: string]: number }>({});
  const [usageAmounts, setUsageAmounts] = useState<{ [key: string]: number[] }>({});

  // ✅ สำคัญ: rows structure ครบทั้งหมด
  const rows = [
    { label: "1. หมวดที่ดิน (งป.005)" },
    {
      label: "2. หมวดสิ่งก่อสร้าง",
      isSummary: true,
      sumFrom: [
        "2.1 งานโยธา (งป.006)",
        "  - ค่าที่ดินอุปกรณ์ (งป.007)",
        "  - ค่าจ้างแรงงาน",
        "  - ค่าขนส่ง",
        "  - ค่าดำเนินการ",
        "  - ค่าตรวจสอบและควบคุมงาน",
        "  - ค่าดำเนินคดี",
        "  - อื่น ๆ",
      ],
    },
    { label: "2.1 งานโยธา (งป.006)", indent: 2 },
    {
      label: "2.2 งานระบบไฟฟ้า",
      indent: 2,
      isSummary: true,
      sumFrom: [
        "  - ค่าที่ดินอุปกรณ์ (งป.007)",
        "  - ค่าจ้างแรงงาน",
        "  - ค่าขนส่ง",
        "  - ค่าดำเนินการ",
        "  - ค่าตรวจสอบและควบคุมงาน",
        "  - ค่าดำเนินคดี",
        "  - อื่น ๆ",
      ],
    },
    { label: "  - ค่าที่ดินอุปกรณ์ (งป.007)", indent: 3 },
    { label: "  - ค่าจ้างแรงงาน", indent: 3 },
    { label: "  - ค่าขนส่ง", indent: 3 },
    { label: "  - ค่าดำเนินการ", indent: 3 },
    { label: "  - ค่าตรวจสอบและควบคุมงาน", indent: 3 },
    { label: "  - ค่าดำเนินคดี", indent: 3 },
    { label: "  - อื่น ๆ", indent: 3 },
    { label: "3. หมวดค่าครุภัณฑ์ (งป.008)" },
    { label: "4. หมวดค่าซ่อมบำรุง (งป.008)" },
    { label: "5. หมวดเครื่องมือ เครื่องใช้ขนาดเล็ก (งป.008)" },
    { label: "6. หมวดวิจัยและพัฒนา (งป.008)" },
    { label: "7. หมวดอื่น ๆ (งป.008)" },
    { label: "8. จ้างเหมา" },
    {
      label: "รวมทั้งหมด",
      isSummary: true,
      sumFrom: [
        "1. หมวดที่ดิน (งป.005)",
        "2. หมวดสิ่งก่อสร้าง",
        "3. หมวดค่าครุภัณฑ์ (งป.008)",
        "4. หมวดค่าซ่อมบำรุง (งป.008)",
        "5. หมวดเครื่องมือ เครื่องใช้ขนาดเล็ก (งป.008)",
        "6. หมวดวิจัยและพัฒนา (งป.008)",
        "7. หมวดอื่น ๆ (งป.008)",
        "  - ค่าที่ดินอุปกรณ์ (งป.007)",
        "  - ค่าจ้างแรงงาน",
        "  - ค่าขนส่ง",
        "  - ค่าดำเนินการ",
        "  - ค่าตรวจสอบและควบคุมงาน",
        "  - ค่าดำเนินคดี",
        "  - อื่น ๆ",
        "8. จ้างเหมา",
      ],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBudgetRequests(subProjectId, selectedYear);

        const allocated: { [key: string]: number } = {};
        const usage: { [key: string]: number[] } = {};

        data.forEach((item: any) => {
          if (!usage[item.List]) {
            usage[item.List] = Array(years.length).fill(0);
          }

          const yearIndex = years.indexOf(item.Year);

          if (yearIndex !== -1) {
            if (item.RequestPay === "request") {
              allocated[item.List] = item.Value;
            } else if (item.RequestPay === "pay") {
              usage[item.List][yearIndex] = item.Value;
            }
          }
        });

        setAllocatedAmounts(allocated);
        setUsageAmounts(usage);
      } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
      }
    };

    fetchData();
  }, [subProjectId, selectedYear, years]);

  const handleInputChange = (
    type: "allocated" | "usage",
    label: string,
    yearIndex: number,
    value: string
  ) => {
    const parsedValue = parseFloat(value) || 0;

    if (type === "allocated") {
      setAllocatedAmounts((prev) => ({
        ...prev,
        [label]: parsedValue,
      }));
    } else {
      setUsageAmounts((prev) => ({
        ...prev,
        [label]: prev[label]
          ? prev[label].map((v, i) => (i === yearIndex ? parsedValue : v))
          : Array(years.length).fill(0).map((v, i) => (i === yearIndex ? parsedValue : v)),
      }));
    }
  };

  const calculateSum = (sumFrom: string[], yearIndex?: number) => {
    return sumFrom.reduce((total, key) => {
      if (yearIndex !== undefined) {
        return total + (usageAmounts[key]?.[yearIndex] || 0);
      } else {
        return total + (allocatedAmounts[key] || 0);
      }
    }, 0);
  };

  const handleSave = async () => {
    const payload = [];
  
    for (const row of rows) {
      if (row.isSummary) continue;
  
      const requestYearly = allocatedAmounts[row.label] || 0;
  
      if (requestYearly !== 0) {
        payload.push({
          list: row.label,
          year: selectedYear,
          requestedYear: selectedYear, // ✅ เพิ่มตรงนี้
          requestPay: "request",
          value: requestYearly,
          commitInvest: "invest",
        });
      }
  
      years.forEach((year, yearIndex) => {
        const payYearly = usageAmounts[row.label]?.[yearIndex] || 0;
        if (payYearly !== 0) {
          payload.push({
            list: row.label,
            year,
            requestedYear: selectedYear, // ✅ เพิ่มตรงนี้
            requestPay: "pay",
            value: payYearly,
            commitInvest: year === selectedYear ? "invest" : "commit",
          });
        }
      });
    }
  
    if (payload.length === 0) {
      alert("กรุณากรอกข้อมูลอย่างน้อยหนึ่งบรรทัด");
      return;
    }
  
    try {
      await saveBudgetRequests(subProjectId, payload);
      alert("บันทึกข้อมูลสำเร็จ");
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };


  return (
    
    <div>
      <h2 className="text-xl font-bold mb-4">ตั้งงบประมาณสำหรับปี {selectedYear}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 min-w-max">
          <thead>
            <tr className="bg-gray-200">
              <th rowSpan={2} className="border px-4 py-2 text-center">รายการ</th>
              <th rowSpan={2} className="border px-4 py-2 text-center">วงเงินดำเนินการ</th>
              <th colSpan={years.length} className="border px-4 py-2 text-center">เป้าหมายการเบิกจ่าย</th>
              <th rowSpan={2} className="border px-4 py-2 text-center">รวม</th>
            </tr>
            <tr className="bg-gray-200">
              {years.map((year) => (
                <th key={year} className="border px-4 py-2 text-center">{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className={row.isSummary ? "bg-gray-100 font-semibold" : ""}>
                <td className={`border px-4 py-2 ${row.indent ? `pl-${row.indent * 4}` : ""}`}>{row.label}</td>
                <td className="border px-4 py-2">
                  {row.isSummary ? calculateSum(row.sumFrom || []) : (
                    <input
                      type="text"
                      className="w-full px-2 py-1 border rounded-md"
                      placeholder="..."
                      value={allocatedAmounts[row.label] || ""}
                      onChange={(e) => handleInputChange("allocated", row.label, 0, e.target.value)}
                    />
                  )}
                </td>
                {years.map((_, i) => (
                  <td key={i} className="border px-4 py-2">
                    {row.isSummary ? calculateSum(row.sumFrom || [], i) : (
                      <input
                        type="text"
                        className="w-full px-2 py-1 border rounded-md"
                        placeholder="..."
                        value={usageAmounts[row.label]?.[i] || ""}
                        onChange={(e) => handleInputChange("usage", row.label, i, e.target.value)}
                      />
                    )}
                  </td>
                ))}
                <td className="border px-4 py-2 text-center font-bold">
                  {row.isSummary
                    ? calculateSum(row.sumFrom || [])
                    : usageAmounts[row.label]?.reduce((sum, num) => sum + num, 0) || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleSave}
        className="mt-4 p-2 bg-blue-600 text-white rounded"
      >
        💾 บันทึกข้อมูล
      </button>
    </div>
  );
}
