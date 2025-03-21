import { Component, useState } from "react";
import Form004_1 from "../components/CreateForm/004-1";
import Form004_2 from "../components/CreateForm/004-2";
import Form004_4main from "../components/CreateForm/004-4main";
import Form005_1 from "../components/CreateForm/005-1";
import Form006 from "../components/CreateForm/006";
import Form005_2 from "../components/CreateForm/005-2";
import Form005_3 from "../components/CreateForm/005-3";
import Form005_4 from "../components/CreateForm/005-4";

export default function TabForm() {
  const [activeTab, setActiveTab] = useState("004-1");
  const [activeSubTab, setActiveSubTab] = useState("");

  const tabs = [
    { name: "004-1", component: <Form004_1 /> },
    { name: "004-2", component: <Form004_2 /> },
    { name: "004-4", component: <Form004_4main />},
    { name: "005",
      subTabs: [
        { name: "005-1", component: <Form005_1 /> },
        { name: "005-2", component: <Form005_2 /> },
        { name: "005-3", component: <Form005_3 /> },
        { name: "005-4", component: <Form005_4 /> },
      ],
     },
    { name: "006", component: <Form006 />},
  ];

  const currentTab = tabs.find((t) => t.name === activeTab);

  return (
    <div>
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
              onClick={() => {
                setActiveTab(tab.name);
                setActiveSubTab(""); // reset subtab
              }}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Sub Tabs */}
      {currentTab?.subTabs && (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mt-2">
          <ul className="flex flex-wrap -mb-px justify-center">
            {currentTab.subTabs.map((sub) => (
              <li
                key={sub.name}
                className={`cursor-pointer px-4 py-2 border-b-2 ${
                  activeSubTab === sub.name
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent hover:text-blue-500"
                }`}
                onClick={() => setActiveSubTab(sub.name)}
              >
                {sub.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Render Content */}
      <div className="p-6">
        {currentTab?.subTabs
          ? currentTab.subTabs.find((s) => s.name === activeSubTab)?.component
          : currentTab?.component}
      </div>
    </div>
  );
}
