import { useState } from "react";
import Form004_1 from "../components/CreateForm/004-1";
import TabItem from "../components/CreateForm/CreateHeader";
import Form004_2 from "../components/CreateForm/004-2";
import Form004_4 from "../components/CreateForm/004-4";


export default function TabForm() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {["004-1", "004-2", "004-4"].map((tab) => (
            <TabItem
              key={tab}
              name={tab}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </ul>
      </div>

      {/* Render Form Based on Active Tab */}
      <div className="p-6">
        {activeTab === "004-1" && <Form004_1 />}
        {activeTab === "004-2" && <Form004_2 />}
        {activeTab === "004-4" && <Form004_4 />}
      </div>
    </div>
  );
}
