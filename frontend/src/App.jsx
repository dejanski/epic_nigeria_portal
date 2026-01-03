import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterPatient from './pages/RegisterPatient';
import ClinicalNotes from './pages/ClinicalNotes';
import Pharmacy from './pages/Prescriptions';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import Appointments from './pages/Appointments';
import LabDashboard from './pages/LabDashboard';
import ClaimsDashboard from './pages/ClaimsDashboard';
import AuditLog from './pages/AuditLog';
import StaffManagement from './pages/StaffManagement';
import Settings from './pages/Settings';

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/patients"
          element={isAuthenticated ? <PatientList /> : <Navigate to="/" />}
        />
        <Route
          path="/patients/:id"
          element={isAuthenticated ? <PatientDetail /> : <Navigate to="/" />}
        />
        <Route
          path="/appointments"
          element={isAuthenticated ? <Appointments /> : <Navigate to="/" />}
        />
        <Route
          path="/labs"
          element={isAuthenticated ? <LabDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/claims"
          element={isAuthenticated ? <ClaimsDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/audit"
          element={isAuthenticated ? <AuditLog /> : <Navigate to="/" />}
        />
        <Route
          path="/register-patient"
          element={isAuthenticated ? <RegisterPatient /> : <Navigate to="/" />}
        />
        <Route
          path="/clinical"
          element={isAuthenticated ? <ClinicalNotes /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/" />}
        />
        <Route
          path="/pharmacy"
          element={isAuthenticated ? <Pharmacy /> : <Navigate to="/" />}
        />
        <Route
          path="/staff"
          element={isAuthenticated ? <StaffManagement /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
