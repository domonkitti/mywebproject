import { useLocation } from 'react-router-dom'

type SidebarProps = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation() // ใช้ useLocation เพื่อดึง path ปัจจุบัน

  const getActiveClass = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-black'
  }

  return (
    <>
      <button
        type="button"
        data-drawer-toggle="logo-sidebar"
        onClick={toggleSidebar}
        className="text-gray-500 hover:bg-gray-100"
      >
        Toggle Sidebar
      </button>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            {/* <li>
              <a
                href="/Course"
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                  location.pathname === '/Course' ? 'bg-gray-200' : ''
                }`}
              >
                <svg
                  className={`w-6 h-6 ${getActiveClass('/Course')}`} // ตั้งสี active ที่ icon
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
                  />
                </svg>
                <span className="ms-3">Course</span>
              </a>
            </li> */}
            <li>
              <a
                href="/AllClass"
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                  location.pathname === '/AllClass' ? 'bg-gray-200' : ''
                }`}
              >
                <svg
                  className={`w-6 h-6 ${getActiveClass('/AllClass')}`} // ตั้งสี active ที่ icon
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
                  />
                </svg>
                <span className="ms-3">AllClass</span>
              </a>
            </li>
            <li>
              <a
                href="/CreateClass"
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                  location.pathname === '/CreateClass' ? 'bg-gray-200' : ''
                }`}
              >
                <svg
                  className={`w-6 h-6 ${getActiveClass('/CreateClass')}`} // ตั้งสี active ที่ icon
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.005 11.19V12l6.998 4.042L19 12v-.81M5 16.15v.81L11.997 21l6.998-4.042v-.81M12.003 3 5.005 7.042l6.998 4.042L19 7.042 12.003 3Z"
                  />
                </svg>
                <span className="ms-3">Create Class</span>
              </a>
            </li>
            <li>
              <a
                href="/CompanyEnrolled"
                className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                  location.pathname === '/CompanyEnrolled' ? 'bg-gray-200' : ''
                }`}
              >
                <svg
                  className={`w-6 h-6 ${getActiveClass('/CompanyEnrolled')}`} // ตั้งสี active ที่ icon
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                  />
                </svg>

                <span className="ms-3">CompanyEnrolled</span>
              </a>
            </li>
            {/* <ul className="pt-2 mt-2 space-y-2 font-medium border-t border-gray-200">
              <li>
                <a
                  href="/Email"
                  className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 ${
                    location.pathname === '/Email' ? 'bg-gray-200' : ''
                  }`}
                >
                  <svg
                    className={`w-6 h-6 ${getActiveClass('/Email')}`} // ตั้งสี active ที่ icon
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 16v-5.5A3.5 3.5 0 0 0 7.5 7m3.5 9H4v-5.5A3.5 3.5 0 0 1 7.5 7m3.5 9v4M7.5 7H14m0 0V4h2.5M14 7v3m-3.5 6H20v-6a3 3 0 0 0-3-3m-2 9v4m-8-6.5h1"
                    />
                  </svg>

                  <span className="ms-3">Email</span>
                </a>
              </li>
            </ul> */}
          </ul>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
