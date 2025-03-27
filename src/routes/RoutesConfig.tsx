import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import ClassPage from '../pages/ProjectPage.tsx'
import WaitingProjectPage from '../pages/WaitingProjectsPage.tsx'
import ReviewingProjectPage from '../pages/ReviewingProjectsPage.tsx'
import ProjectPage from '../pages/ProjectPage.tsx'
import AdminTablePage from '../pages/AdminTablePage.tsx'
import NewProject from '../pages/NewProject.tsx'
import SelectDataType from '../components/EditForm/SelectDataType.tsx'
import TabFormBasic from '../pages/EditProjectsBasic.tsx'
import TabFormNum from '../pages/EditProjectsNum.tsx'
import ConfirmApprove from '../pages/ConfirmApprove.tsx'

function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/editproject/:projectId" element={<SelectDataType />} />
      <Route path="/editproject/:projectId/basic" element={<TabFormBasic />} />
      <Route path="/editproject/:projectId/numeric" element={<TabFormNum />} />
      <Route path="/AllRequest" element={<ClassPage />} />
      <Route path="/allprojects" element={<ProjectPage />} />
      <Route path="/reviewingprojects" element={<ReviewingProjectPage />} />
      <Route path="/waitingprojects" element={<WaitingProjectPage />} />
      <Route path="/edittable" element={<AdminTablePage />} />
      <Route path="/newproject" element={<NewProject />} />
      <Route path="/ConfirmApprove/:projectId" element={<ConfirmApprove />} />
    </Routes>
  )
}

export default RoutesConfig
