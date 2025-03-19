import { Routes, Route } from 'react-router-dom'
// import EmailPage from '../pages/EmailPage'
import LandingPage from '../pages/LandingPage'
import CreateClass from '../pages/CreateProjects'

import ClassPage from '../pages/ProjectPage.tsx'
import WaitingProjectPage from '../pages/WaitingProjectsPage.tsx'
import ReviewingProjectPage from '../pages/ReviewingProjectsPage.tsx'
import ProjectPage from '../pages/ProjectPage.tsx'
import AdminTablePage from '../pages/AdminTablePage.tsx'

function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/CreateClass" element={<CreateClass />} />
      <Route path="/AllRequest" element={<ClassPage />} />
      <Route path="/allprojects" element={<ProjectPage />} />
      <Route path="/reviewingprojects" element={<ReviewingProjectPage />} />
      <Route path="/waitingprojects" element={<WaitingProjectPage />} />
      <Route path="/edittable" element={<AdminTablePage />} />
      {/* <Route path="/Email" element={<EmailPage />} /> */}
      {/* <Route path="/Course" element={<CompanyList />} /> */}
    </Routes>
  )
}

export default RoutesConfig
