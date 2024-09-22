// src/App.jsx
import React from "react";
import { Routes, Route, Router } from "react-router-dom";

// Layout Component
import Layout from "../src/components/Layout";

// Page Components
import SignIn from "./auth/SignIn";

// Case Management Components 1
import CaseManagement from "./pages/CaseManagement/CaseManagment";
import ViewCase from "./pages/CaseManagement/ViewCase";

// Document Management Components
import DocumentManagement from "./pages/DocumentManagement/DocumentManagement";
import AddDocument from "./pages/DocumentManagement/AddDcoument";
import UpdateDocument from "./pages/DocumentManagement/UpdateDocument";

// User Management Components
import UserManagement from "./pages/UserManagement/UserManagement";
import AddAttorneyForm from "./pages/UserManagement/AddAttorneyForm";
import AddExpertForm from "./pages/UserManagement/AddExpertForm";
import AddClaimantForm from "./pages/UserManagement/AddClaimantForm";
import AddDoctorForm from "./pages/UserManagement/AddDoctorForm";
import ViewDoctor from "./pages/UserManagement/ViewDoctor";
import ViewExpert from "./pages/UserManagement/ViewExpert";
import ViewAttorney from "./pages/UserManagement/ViewAttorney";
import ViewClaimant from "./pages/UserManagement/ViewcClaimant";
import UpdateDoctorForm from "./pages/UserManagement/UpdateDoctorForm";
import UpdateClaimantForm from "./pages/UserManagement/UpdateClaimantForm";
import UpdateAttorneyForm from "./pages/UserManagement/UpdateAttorneyForm";
import UpdateExpertForm from "./pages/UserManagement/UpdateExpertForm";
import ViewDocument from "./pages/DocumentManagement/ViewDocument";
import MultiStepCaseForm from "./pages/CaseManagement/MultiStepCaseForm";
import MultiStepUpdateCaseForm from "./pages/CaseManagement/MultiStepUpdateCaseForm";
// 404 Page Component
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AdminManagement from "./pages/SuperAdmin/AdminManagement/AdminManagement";
import AddAdminForm from "./pages/SuperAdmin/AdminManagement/AddAdminForm";
import AttorneyViewCase from "./pages/Attorney/AttorneyViewCase";
import AttorneyCaseManagement from "./pages/Attorney/AttorneyCaseManagement";
import AttorneyViewDocument from "./pages/Attorney/AttorneyViewDocument";
import AttorneyDashboard from "./pages/Attorney/AttorneyDashboard";
import ExpertViewCase from "./pages/Expert/ExpertViewCase";
import ExpertCaseManagement from "./pages/Expert/ExpertCaseManagement";
import ExpertViewDocument from "./pages/Expert/ExpertViewDocument";
import ExpertDashboard from "./pages/Expert/ExpertDashboard";

import useAxiosInterceptors from "./hooks/AxiosInterceptors";
import SuperAdminDashboard from "./pages/SuperAdmin/AdminManagement/SuperAdminDashboard";
import SettingsPage from "./pages/SettingsPage";
import Chat from "./pages/Chat";
import CompanyManagement from "./pages/SuperAdmin/CompanyManagement/CompanyManagement";
import AddCompanyForm from "./pages/SuperAdmin/CompanyManagement/AddCompanyForm";
import UpdateCompanyForm from "./pages/SuperAdmin/CompanyManagement/UpdateCompanyForm";
import ViewAdmin from "./pages/SuperAdmin/AdminManagement/ViewAdmin";
import UpdateAdminForm from "./pages/SuperAdmin/AdminManagement/UpdateAdminForm";
import ViewCompany from "./pages/SuperAdmin/CompanyManagement/ViewCompany";
import AddDocumentFromCase from "./pages/DocumentManagement/AddDocumentFromCase";
import AuditTrail from "./pages/SuperAdmin/AuditTrail";
import AdminDashboard from "./pages/AdminDashboard";
import AttorneyViewAttorney from "./pages/Attorney/AttorneyViewAttorney";
import AttorneyViewDoctor from "./pages/Attorney/AttorneyViewDoctor";
import AttorneyViewClaimant from "./pages/Attorney/AttorneyViewClaimant";
import AttorneyViewExpert from "./pages/Attorney/AttorneyViewExpert";
import ExpertViewAttorney from "./pages/Expert/ExpertViewAttorney";
import ExpertViewDoctor from "./pages/Expert/ExpertViewDoctor";
import ExpertViewClaimant from "./pages/Expert/ExpertViewClaimant";
import ExpertViewExpert from "./pages/Expert/ExpertViewExpert";
import ExpertAddDocumentFromCase from "./pages/Expert/ExpertAddDocumentFromCase";
import ExpertDocumentManagement from "./pages/Expert/ExpertDocumentManagement";
import AttorneyDocumentManagement from "./pages/Attorney/AttorneyDocumentManagement";
import AttorneyAddDocumentFromCase from "./pages/Attorney/AttorneyAddDocumentFromCase";

const App = () => {
  useAxiosInterceptors(); // Initialize Axios interceptors

  return (
    <>
      <Loader />
      <AuthProvider>
        <Routes>
          {/* Authentication Route */}
          <Route path="/login" element={<SignIn />} />
          <Route
            path="/"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "attorney", "super_admin", "expert"]}
              >
                <SignIn />
              </ProtectedRoute>
            }
          />

          {/* Home Route */}

          {/* Settings Route */}
          <Route
            path="/settings"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "attorney"]}>
                  <SettingsPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          {/* Chat Route */}
          <Route
            path="/chat"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "attorney", "expert"]}>
                  <Chat />
                </ProtectedRoute>
              </Layout>
            }
          />

          {/* User Management Routes */}
          <Route
            path="users"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <UserManagement />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-add/claimant/"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AddClaimantForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-add/attorney/"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AddAttorneyForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-add/doctor/"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AddDoctorForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-add/expert/"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AddExpertForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-update/claimant/:claimant_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <UpdateClaimantForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-update/attorney/:attorney_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <UpdateAttorneyForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-update/doctor/:doctor_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <UpdateDoctorForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-update/expert/:expert_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <UpdateExpertForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-view/claimant/:claimant_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <ViewClaimant />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-view/attorney/:attorney_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <ViewAttorney />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-view/doctor/:doctor_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <ViewDoctor />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="user-view/expert/:expert_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <ViewExpert />
                </ProtectedRoute>
              </Layout>
            }
          />

          {/* Case Management Routes */}
          <Route
            path="case"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <CaseManagement />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="case/add"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <MultiStepCaseForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="case/update/:case_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <MultiStepUpdateCaseForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="case/view/:case_id"
            element={
              <Layout>
                <ProtectedRoute
                  allowedRoles={["admin", "attorney", "super_admin"]}
                >
                  <ViewCase />
                </ProtectedRoute>
              </Layout>
            }
          />

          {/* Document Management Routes */}
          <Route
            path="document"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <DocumentManagement />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="document/view/:document_id"
            element={
              <Layout>
                <ProtectedRoute
                  allowedRoles={["admin", "attorney", "super_admin"]}
                >
                  <ViewDocument />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="document/add"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AddDocument />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="document/add/:case_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AddDocumentFromCase />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="document/update/:document_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <UpdateDocument />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              </Layout>
            }
          />
          {/* 404 Route */}
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <AdminManagement />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/superAdmin/auditTrail"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <AuditTrail />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/admin/view/:admin_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <ViewAdmin />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/admin/add"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <AddAdminForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/admin/update/:admin_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <UpdateAdminForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/superAdmin/dashboard"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              </Layout>
            }
          />
          {/* Company Route */}

          <Route
            path="/company"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <CompanyManagement />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="company/add"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <AddCompanyForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/company/update/:company_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <UpdateCompanyForm />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/company/view/:company_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <ViewCompany />
                </ProtectedRoute>
              </Layout>
            }
          />
          {/* Attorney Route */}
          <Route
            path="/attDash"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["attorney"]}>
                  <AttorneyDashboard />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/attorney"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["attorney"]}>
                  <AttorneyCaseManagement />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/attorney/case/view/:case_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["attorney"]}>
                  <AttorneyViewCase />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/attorney/case/view/attorney/:attorney_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["attorney"]}>
                  <AttorneyViewAttorney />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/attorney/case/view/doctor/:doctor_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["attorney"]}>
                  <AttorneyViewDoctor />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/attorney/case/view/claimant/:claimant_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["attorney"]}>
                  <AttorneyViewClaimant />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/attorney/case/view/expert/:expert_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["attorney"]}>
                  <AttorneyViewExpert />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/attDocument/view/:document_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["attorney"]}>
                  <AttorneyViewDocument />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/attDocument"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["attorney"]}>
                  <AttorneyDocumentManagement />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/attorney/case/document/add/:case_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["attorney"]}>
                  <AttorneyAddDocumentFromCase />
                </ProtectedRoute>
              </Layout>
            }
          />
          {/* Expert Route */}
          <Route
            path="/expDash"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["expert"]}>
                  <ExpertDashboard />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/expert"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["expert"]}>
                  <ExpertCaseManagement />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/expert/case/view/:case_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["expert"]}>
                  <ExpertViewCase />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/expert/case/document/add/:case_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["expert"]}>
                  <ExpertAddDocumentFromCase />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/expert/case/view/expert/:expert_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["expert"]}>
                  <ExpertViewExpert />
                </ProtectedRoute>
              </Layout>
            }
          />

          <Route
            path="/expert/case/view/doctor/:doctor_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["expert"]}>
                  <ExpertViewDoctor />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/expert/case/view/claimant/:claimant_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["expert"]}>
                  <ExpertViewClaimant />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/expert/case/view/expert/:expert_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["expert"]}>
                  <ExpertViewAttorney />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/expert/document/view/:document_id"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["expert"]}>
                  <ExpertViewDocument />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/expDocument"
            element={
              <Layout>
                <ProtectedRoute allowedRoles={["expert"]}>
                  <ExpertDocumentManagement />
                </ProtectedRoute>
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;
