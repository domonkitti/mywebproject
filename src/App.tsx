import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import RoutesConfig from './routes/RoutesConfig' 
import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="">
          <div
            className={`ml-64 p-6 mt-16 transition-all ${
              isSidebarOpen ? 'ml-64' : 'ml-0'
            }`}
          >
            <div className="container mx-auto">
              <RoutesConfig />
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}


export default App
