import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form004_1 from "../../components/EditForm/004-1";
import Form004_2 from "../../components/EditForm/004-2";
import Form004_4main from "../../components/EditForm/004-4main";

export default function TabFormBasic() {
  const [activeTab, setActiveTab] = useState("004-1");
  const navigate = useNavigate();

  const tabs = [
    { name: "004-1", component: <Form004_1 /> },
    { name: "004-2", component: <Form004_2 /> },
    { name: "004-4", component: <Form004_4main /> },
  ];

  const currentTab = tabs.find((t) => t.name === activeTab);

  return (
    <div>
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← กลับ
        </button>
      </div>

      {/* Main Tabs */}
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <li
              key={tab.name}
              className={`cursor-pointer px-4 py-2 border-b-2 ${
                activeTab === tab.name
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent hover:text-blue-500"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Render Content */}
      <div className="p-6">{currentTab?.component}</div>
    </div>
  );
}
