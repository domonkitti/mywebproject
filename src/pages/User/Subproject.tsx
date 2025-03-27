import React, { useState } from "react";
import { Link } from "react-router-dom";

interface SubProject {
  id: number;
  name: string;
  totalBudget: number;
}

const CreateSubprojectPage = () => {
  const [subProjects, setSubProjects] = useState<SubProject[]>([
    { id: 1, name: "งานย่อย A-1", totalBudget: 150000 },
    { id: 2, name: "งานย่อย A-2", totalBudget: 120000 },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState(0);

  const handleAdd = () => {
    if (!newName || newBudget <= 0) return;
    const newSubProject: SubProject = {
      id: Date.now(),
      name: newName,
      totalBudget: newBudget,
    };
    setSubProjects((prev) => [...prev, newSubProject]);
    setNewName("");
    setNewBudget(0);
  };

  const handleDelete = (id: number) => {
    setSubProjects((prev) => prev.filter((sp) => sp.id !== id));
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleSave = (id: number, name: string, totalBudget: number) => {
    setSubProjects((prev) =>
      prev.map((sp) => (sp.id === id ? { ...sp, name, totalBudget } : sp))
    );
    setEditingId(null);
  };

  const totalSum = subProjects.reduce((sum, sp) => sum + sp.totalBudget, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">สร้างงานย่อยภายใต้โครงการ</h1>

      <table className="w-full border border-collapse text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2 text-left">ชื่องานย่อย</th>
            <th className="border px-4 py-2 text-right">วงเงินเต็มแผน (บาท)</th>
            <th className="border px-4 py-2 text-center">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {subProjects.map((sp) => (
            <tr key={sp.id}>
              <td className="border px-4 py-2">{sp.name}</td>
              <td className="border px-4 py-2 text-right">{sp.totalBudget.toLocaleString()}</td>
              <td className="border px-4 py-2 text-center space-x-2">
                <Link
                  to={`/editproject/P001/numeric/${sp.id}`}
                  className="text-blue-600 hover:underline"
                >
                  แก้ไข
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
    </div>
  );
};

export default CreateSubprojectPage;
