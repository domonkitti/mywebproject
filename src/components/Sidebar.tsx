import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

type SidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();

  // ✅ โหลดค่าเริ่มต้นจาก localStorage หรือใช้ค่า default
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return localStorage.getItem("isAdminOpen") === "true";
  });

  const [isUnitOpen, setIsUnitOpen] = useState(() => {
    return localStorage.getItem("isUnitOpen") !== "false"; // default: true
  });

  // ✅ บันทึกค่าลง localStorage ทุกครั้งที่มีการเปลี่ยนค่า
  useEffect(() => {
    localStorage.setItem("isAdminOpen", String(isAdminOpen));
  }, [isAdminOpen]);

  useEffect(() => {
    localStorage.setItem("isUnitOpen", String(isUnitOpen));
  }, [isUnitOpen]);

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        className="text-gray-500 hover:bg-gray-100"
      >
        Toggle Sidebar
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r border-gray-200 sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          {/* === หน่วยงาน === */}
          <div>
            <button
              onClick={() => setIsUnitOpen(!isUnitOpen)}
              className="w-full text-left text-gray-900 p-2 font-semibold hover:bg-gray-100 flex justify-between"
            >
              หน่วยงาน
              <span>{isUnitOpen ? "▲" : "▼"}</span>
            </button>
            {isUnitOpen && (
              <ul className="space-y-2 font-medium pl-4">
                <li>
                  <a
                    href="/AllClass"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                      location.pathname === "/AllClass" ? "text-blue-600 bg-gray-200" : "text-black"
                    }`}
                  >
                    📚 <span className="ml-3">AllProject</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/CreateClass"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                      location.pathname === "/CreateClass" ? "text-blue-600 bg-gray-200" : "text-black"
                    }`}
                  >
                    🏗 <span className="ml-3">Create New</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/allprojects"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                      location.pathname === "/CompanyEnrolled" ? "text-blue-600 bg-gray-200" : "text-black"
                    }`}
                  >
                    📜 <span className="ml-3">งบประมาณที่ขอตั้ง</span>
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* === Admin === */}
          <div className="mt-4 border-t border-gray-300 pt-2">
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className="w-full text-left text-gray-900 p-2 font-semibold hover:bg-gray-100 flex justify-between"
            >
              Admin
              <span>{isAdminOpen ? "▲" : "▼"}</span>
            </button>
            {isAdminOpen && (
              <ul className="space-y-2 font-medium pl-4">
                <li>
                  <a
                    href="/reviewingprojects"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                      location.pathname === "/reviewingprojects" ? "text-blue-600 bg-gray-200" : "text-black"
                    }`}
                  >
                    📜 <span className="ml-3">Reviewing projects</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/waitingprojects"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                      location.pathname === "/waitingprojects" ? "text-blue-600 bg-gray-200" : "text-black"
                    }`}
                  >
                    📜 <span className="ml-3">waitingprojects</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/ManageUsers"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                      location.pathname === "/ManageUsers" ? "text-blue-600 bg-gray-200" : "text-black"
                    }`}
                  >
                    👤 <span className="ml-3">Manage Users</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/Settings"
                    className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                      location.pathname === "/Settings" ? "text-blue-600 bg-gray-200" : "text-black"
                    }`}
                  >
                    ⚙️ <span className="ml-3">Settings</span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
