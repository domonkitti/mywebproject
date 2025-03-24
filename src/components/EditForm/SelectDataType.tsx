import { useNavigate, useParams } from "react-router-dom";

export default function SelectDataType() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-8">เลือกประเภทที่ต้องการแก้ไข</h1>
      <div className="flex flex-col space-y-6 w-full max-w-xs">
        <button
          onClick={() => navigate(`/editproject/${projectId}/basic`)}
          className="bg-blue-600 text-white py-4 px-6 rounded-lg text-lg shadow hover:bg-blue-700"
        >
          ข้อมูลทั่วไป
        </button>
        <button
          onClick={() => navigate(`/editproject/${projectId}/numeric`)}
          className="bg-green-600 text-white py-4 px-6 rounded-lg text-lg shadow hover:bg-green-700"
        >
          กรอกข้อมูลตัวเลข
        </button>
      </div>
    </div>
  );
}