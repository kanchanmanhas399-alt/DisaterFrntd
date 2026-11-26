import './App.css';
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/user/userLayout/Layout';
import Home from './components/user/Pages/Home';
import Alert from './components/user/Pages/Alert';
import About from './components/user/Pages/About';
import Login from './components/user/Pages/Login';
import Register from './components/user/Pages/Register';
import Resources from './components/user/Pages/Resources';
import Safety from './components/user/Pages/Safety';
import ReportEmergency from './components/user/Pages/ReportEmergency';
import Sos from './components/user/Pages/Sos';
import UserDashboard from './components/user/Pages/UserDashboard';
import EmergencyHistory from './components/user/Pages/EmergencyHistory';
import AssessmentResults from './components/user/Pages/AssessmentResults';

import { ProtectedUserRoute, ProtectedAdminRoute } from './components/common/ProtectedRoute';

import AdminLayout from './components/admin/adminLayout/AdminLayout';
import Dashboard from './components/admin/Pages/Dashboard';
import Alerts from './components/admin/Pages/Alerts';
import Disaster from './components/admin/Pages/Disaster/Disaster';
import Hospitals from './components/admin/Pages/Hospital/Hospitals';
import Profile from './components/admin/Pages/Profile';
import ReporstDetails from './components/admin/Pages/ReporstDetails';
import Reports from './components/admin/Pages/Reports';
import RescueCenters from './components/admin/Pages/rescueCenter/RescueCenters';
import Shelters from './components/admin/Pages/Shelters/Shelters';
import Users from './components/admin/Pages/User/Users';
import ResourcesAdmin from './components/admin/Pages/ResourcesAdmin';
import SafetyAdmin from './components/admin/Pages/SafetyAdmin';
import Categories from './components/admin/category/Categories';
import AddDisasterCategory from './components/admin/category/AddDisasterCategory';
import AddRescueCenter from './components/admin/Pages/rescueCenter/AddRescueCenter';
import EditUser from './components/admin/Pages/User/EditUser';
import EditShelter from './components/admin/Pages/Shelters/EditShelter';
import EditHospital from './components/admin/Pages/Hospital/EditHospital';
import EditDisaster from './components/admin/Pages/Disaster/EditDisaster';
import EditRescueCenter from './components/admin/Pages/rescueCenter/EditRescueCenter';
import EditAlert from './components/admin/Pages/EditAlert';
import AddShelter from './components/admin/Pages/Shelters/AddShelter';
import AddHospital from './components/admin/Pages/Hospital/AddHospital';
import AddUser from './components/admin/Pages/User/AddUser';
import AddDisaster from './components/admin/Pages/Disaster/AddDisaster';

import DisasterEmailRecipients from './components/admin/Pages/DisasterEmailRecipients';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public & Citizen Portal */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/alerts" element={<Alert />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/safety" element={<Safety />} />

            {/* Protected Citizen Routes */}
            <Route path="/emergency" element={
              <ProtectedUserRoute>
                <ReportEmergency />
              </ProtectedUserRoute>
            } />
            <Route path="/sos" element={
              <ProtectedUserRoute>
                <Sos />
              </ProtectedUserRoute>
            } />
            <Route path="/userdashboard" element={
              <ProtectedUserRoute>
                <UserDashboard />
              </ProtectedUserRoute>
            } />
            <Route path="/my-reports" element={
              <ProtectedUserRoute>
                <EmergencyHistory />
              </ProtectedUserRoute>
            } />
            <Route path="/assessment-results/:id" element={
              <ProtectedUserRoute>
                <AssessmentResults />
              </ProtectedUserRoute>
            } />
          </Route>

          {/* Protected Admin Portal */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="alerts/add" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="disaster-email-recipients" element={<DisasterEmailRecipients />} />
            <Route path="report-details/:id" element={<ReporstDetails />} />
            <Route path="reports/:id" element={<ReporstDetails />} />
            <Route path="reporstdetails" element={<ReporstDetails />} />
            <Route path="resources" element={<ResourcesAdmin />} />
            <Route path="resources/edit/:id" element={<ResourcesAdmin />} />
            <Route path="resource-edit/:id" element={<ResourcesAdmin />} />
            <Route path="resources/add" element={<ResourcesAdmin />} />
            <Route path="shelters" element={<Shelters />} />
            <Route path="hospitals" element={<Hospitals />} />
            <Route path="rescuecenters" element={<RescueCenters />} />
            <Route path="RescueCenters" element={<RescueCenters />} />
            <Route path="safety" element={<SafetyAdmin />} />
            <Route path="safety/edit/:id" element={<SafetyAdmin />} />
            <Route path="safety/add" element={<SafetyAdmin />} />
            <Route path="disaster" element={<Disaster />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
            <Route path="categories" element={<Categories />} />
            <Route path="addcategory" element={<AddDisasterCategory />} />
            <Route path="addrescue" element={<AddRescueCenter />} />
            <Route path="add-disaster" element={<AddDisaster />} />
            <Route path="adduser" element={<AddUser />} />
            <Route path="addshelter" element={<AddShelter />} />
            <Route path="addhospital" element={<AddHospital />} />
            <Route path="edituser/:id" element={<EditUser />} />
            <Route path="shelteredit/:id" element={<EditShelter />} />
            <Route path="edithospital/:id" element={<EditHospital />} />
            <Route path="editdisaster/:id" element={<EditDisaster />} />
            <Route path="editrescue/:id" element={<EditRescueCenter />} />
            <Route path="editalert/:id" element={<EditAlert />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
