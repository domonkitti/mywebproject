import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import ClassPage from '../pages/User/ProjectPage.tsx'
import WaitingProjectPage from '../pages/Admin/WaitingProjectsPage.tsx'
import ReviewingProjectPage from '../pages/Admin/ReviewingProjectsPage.tsx'
import ProjectPage from '../pages/User/ProjectPage.tsx'
import AdminTablePage from '../pages/Admin/AdminTablePage.tsx'
import NewProject from '../pages/User/NewProject.tsx'
import SelectDataType from '../pages/User/SelectDataType.tsx'
import TabFormBasic from '../pages/User/EditProjectsBasic.tsx'
import TabFormNum from '../pages/User/EditProjectsNum.tsx'
import ConfirmApprove from '../pages/Admin/ConfirmApprove.tsx'
import CreateSubprojectPage from '../pages/User/Subproject.tsx'

function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/editproject/:projectId" element={<SelectDataType />} />
      <Route path="/editproject/:projectId/basic" element={<TabFormBasic />} />
      <Route path="/editproject/:projectId/numeric/:subproject" element={<TabFormNum />} />
      <Route path="/AllRequest" element={<ClassPage />} />
      <Route path="/allprojects" element={<ProjectPage />} />
      <Route path="/reviewingprojects" element={<ReviewingProjectPage />} />
      <Route path="/waitingprojects" element={<WaitingProjectPage />} />
      <Route path="/edittable" element={<AdminTablePage />} />
      <Route path="/newproject" element={<NewProject />} />
      <Route path="/ConfirmApprove/:projectId" element={<ConfirmApprove />} />
      <Route path="/editproject/:projectId/numeric" element={<CreateSubprojectPage />} />
    </Routes>
  )
}

export default RoutesConfig
