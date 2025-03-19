import { Routes, Route } from 'react-router-dom'
// import EmailPage from '../pages/EmailPage'
import LandingPage from '../pages/LandingPage'
import CreateClass from '../pages/CreateClassPage'
import SendEmailPage from '../pages/SendEmailPage'
import CompanyList from '../components/CompanyEnrolled'
import CompanyList1 from '../components/CompanyClass'
import ClassPage from '../pages/ClassPage'

function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/CreateClass" element={<CreateClass />} />
      <Route path="/AllClass" element={<ClassPage />} />
      <Route path="/CompanyEnrolled" element={<CompanyList />} />
      {/* <Route path="/Email" element={<EmailPage />} /> */}
      {/* <Route path="/Course" element={<CompanyList />} /> */}
      <Route path="/Course/Company/:codename" element={<CompanyList1 />} />
      <Route path="/send-email/:classId" element={<SendEmailPage />} />
    </Routes>
  )
}

export default RoutesConfig
