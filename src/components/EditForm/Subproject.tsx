import { Link } from "react-router-dom";
import { useState } from "react";

interface SubProject {
  id: number;
  name: string;
  totalBudget: number;
}

interface SubprojectProps {
  loading: boolean;
  subProjects: SubProject[];
  onAddSubProject: (name: string, totalBudget: number) => void;
  onDeleteSubProject: (id: number) => void;
  projectId: number;
}

const Subproject: React.FC<SubprojectProps> = ({
  loading,
  subProjects = [],
  onAddSubProject,
  onDeleteSubProject,
  projectId,
}) => {
  console.log("✅ Render Subproject component!");

  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState(0);

  const handleAdd = () => {
    if (!newName || newBudget <= 0) {
      alert("กรุณากรอกชื่อและงบประมาณให้ครบถ้วน");
      return;
    }

    onAddSubProject(newName, newBudget);
    setNewName("");
    setNewBudget(0);
  };

  const handleDelete = (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานย่อยนี้?")) {
      onDeleteSubProject(id);
    }
  };

  const totalSum = Array.isArray(subProjects)
    ? subProjects.reduce((sum, sp) => sum + sp.totalBudget, 0)
    : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        งาน/แผนงาน/โครงการ Project ID: {projectId}
      </h1>

      {loading && <p className="text-center mb-4">กำลังโหลดข้อมูล...</p>}

      <table className="w-full border border-collapse text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2 text-left">ชื่องานย่อย</th>
            <th className="border px-4 py-2 text-right">วงเงินเต็มแผน (บาท)</th>
            <th className="border px-4 py-2 text-center">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(subProjects) &&
            subProjects.map((sp) => (
              <tr key={sp.id}>
                <td className="border px-4 py-2">{sp.name}</td>
                <td className="border px-4 py-2 text-right">
                  {sp.totalBudget.toLocaleString()}
                </td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <Link
                    to={`/editproject/${projectId}/basic/${sp.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    แก้ไขข้อมูลทั่วไป
                  </Link>
                  <Link
                    to={`/editproject/${projectId}/numeric/${sp.id}`}
                    className="text-green-600 hover:underline"
                  >
                    แก้ไขตัวเลข
                  </Link>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(sp.id)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          <tr className="bg-gray-100 font-bold">
            <td className="border px-4 py-2 text-right">รวม</td>
            <td className="border px-4 py-2 text-right">{totalSum.toLocaleString()}</td>
            <td className="border px-4 py-2"></td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">เพิ่มงานย่อยใหม่</h2>
        <div className="flex gap-4">
          <input
            className="border px-2 py-1 flex-1"
            placeholder="ชื่องานย่อย"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="border px-2 py-1 w-48 text-right"
            type="number"
            placeholder="วงเงินเต็มแผน"
            value={newBudget}
            onChange={(e) => setNewBudget(parseInt(e.target.value) || 0)}
          />
          <button
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            onClick={handleAdd}
          >
            ➕ เพิ่ม
          </button>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <button
          className="bg-blue-600 text-white px-20 py-2 rounded hover:bg-green-700"
          onClick={() => alert("TODO: ไปทำรายงานความเสี่ยง")}
        >
          จัดทำรายงานความเสี่ยง
        </button>
      </div>
    </div>
  );
};

export default Subproject;
