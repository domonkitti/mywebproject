import { useEffect, useState } from "react";
import Form004_4details from "./004-4detail";
import { useParams } from "react-router-dom";
import { getBudgetRequests } from "../../apis/UserProjectApi";

export default function Form004_4main() {
  const { subproject: subProjectId } = useParams<{ subproject: string }>();
  const [years, setYears] = useState<number[]>([]);
  const [amountsPerYear, setAmountsPerYear] = useState<{ [year: number]: number }>({});
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [newYear, setNewYear] = useState<number>(new Date().getFullYear() + 543);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!subProjectId) return;

        const data = await getBudgetRequests(Number(subProjectId));

        // ✅ FIX Case Sensitive
        const requestItems = data.filter((item: any) => item.RequestPay === "request");

        const uniqueYears = Array.from(
          new Set(requestItems.map((item: any) => item.Year as number))
        ).sort((a, b) => a - b);

        const amounts: { [year: number]: number } = {};
        requestItems.forEach((item: any) => {
          if (!amounts[item.Year]) {
            amounts[item.Year] = 0;
          }
          amounts[item.Year] += item.Value;
        });

        setYears(uniqueYears);
        setAmountsPerYear(amounts);
      } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
      }
    };

    fetchData();
  }, [subProjectId]);

  const addYear = () => {
    if (years.includes(newYear)) {
      alert("ปีนี้ถูกเพิ่มไปแล้ว");
      return;
    }

    setYears([...years, newYear].sort((a, b) => a - b));
    setNewYear(newYear + 1);
  };

  const removeYear = (year: number) => {
    setYears(years.filter((y) => y !== year));
  };

  const handleClosePopup = () => {
    setSelectedYear(null);
    window.location.reload();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ตั้งงบประมาณรายปี</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2 text-center">ปีงบประมาณ</th>
              <th className="border border-gray-400 px-4 py-2 text-center">วงเงินดำเนินการ (บาท)</th>
              <th className="border border-gray-400 px-4 py-2 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {years.map((year) => (
              <tr key={year}>
                <td className="border border-gray-400 px-4 py-2 text-center">{year}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  {amountsPerYear[year]?.toLocaleString() || "-"}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  <button
                    onClick={() => setSelectedYear(year)}
                    className="p-1 bg-blue-500 text-white rounded mr-2"
                  >
                    ✏️ แก้ไข
                  </button>
                  <button
                    onClick={() => removeYear(year)}
                    className="p-1 bg-red-500 text-white rounded"
                  >
                    🗑️ ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ปุ่มเพิ่มปี */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="number"
          className="border px-2 py-1 rounded"
          value={newYear}
          onChange={(e) => setNewYear(parseInt(e.target.value) || 0)}
        />
        <button
          onClick={addYear}
          className="p-2 bg-green-500 text-white rounded"
        >
          ➕ เพิ่มปี
        </button>
      </div>

      {/* Pop-up */}
      {selectedYear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
          <div className="bg-white p-6 rounded shadow-lg w-4/5 h-4/5 overflow-auto">
            <button
              onClick={handleClosePopup}
              className="p-2 bg-red-500 text-white rounded mb-4"
            >
              ❌ ปิด
            </button>
            <Form004_4details
              selectedYear={selectedYear}
              subProjectId={Number(subProjectId)}
              onSaveSuccess={handleClosePopup}
            />
          </div>
        </div>
      )}
    </div>
  );
}
