import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Users } from 'lucide-react';

import Header from './components/common/Header';
import PatientDetailsForm from './components/prescription/PatientDetailsForm';
import PrescriptionForm from './components/prescription/PrescriptionForm';
import PrescriptionPreview from './components/prescription/PrescriptionPreview';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import PatientList from './components/patient/PatientList';
import { savePrescription } from './utils/storage';

function DoctorInterface() {
  const [patientData, setPatientData] = useState({ name: '', age: '', gender: '', date: new Date().toISOString().split('T')[0] });
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAndPrint = () => {
    if (!patientData.name || !diagnosis) {
      alert('Please fill in patient name and diagnosis');
      return;
    }

    savePrescription({ patientData, diagnosis, medicines });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // In a real app, we might wait for print to finish, but here we just trigger it
    setTimeout(() => window.print(), 500);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear the form?')) {
      setPatientData({ name: '', age: '', gender: '', date: new Date().toISOString().split('T')[0] });
      setDiagnosis('');
      setMedicines([]);
    }
  };

  return (
    <div className="container main-content" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      {/* Helper Nav/Actions */}
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-2xl font-bold text-slate-800">New Prescription</h2>
        <div className="flex gap-2">
          <button onClick={handleReset} className="btn btn-secondary text-sm">Clear Form</button>
          <button onClick={handleSaveAndPrint} className="btn btn-primary">
            Save & Print
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 no-print" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Prescription saved locally.</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="no-print">
          <PatientDetailsForm data={patientData} onChange={setPatientData} />
          <PrescriptionForm
            diagnosis={diagnosis}
            setDiagnosis={setDiagnosis}
            medicines={medicines}
            setMedicines={setMedicines}
          />
        </div>

        <div className="sticky top-4">
          <PrescriptionPreview
            patientData={patientData}
            diagnosis={diagnosis}
            medicines={medicines}
            onPrint={handlePrint}
          />
        </div>
      </div>
    </div>
  );
}

function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 no-print">
      <div className="container flex gap-6">
        <Link
          to="/"
          className={`flex items-center gap-2 py-4 px-2 border-b-2 text-sm font-medium transition-colors ${isActive('/') ? 'border-cyan-600 text-cyan-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <FilePlus size={18} /> Doctor Interface
        </Link>
        <Link
          to="/analytics"
          className={`flex items-center gap-2 py-4 px-2 border-b-2 text-sm font-medium transition-colors ${isActive('/analytics') ? 'border-cyan-600 text-cyan-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <LayoutDashboard size={18} /> Analytics
        </Link>
        <Link
          to="/patients"
          className={`flex items-center gap-2 py-4 px-2 border-b-2 text-sm font-medium transition-colors ${isActive('/patients') ? 'border-cyan-600 text-cyan-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Users size={18} /> Patients
        </Link>
      </div>
    </nav>
  );
}

function HeaderWrapper() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header style={{
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container flex items-center justify-between" style={{ height: '4rem' }}>
        <div className="flex items-center gap-2">
          <div style={{ padding: '0.4rem', background: '#cffafe', borderRadius: '4px' }}>
            <LayoutDashboard size={20} color="var(--color-primary)" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>MediScript</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">{user.name}</span>
          <button onClick={logout} className="text-xs text-red-500 hover:underline">Logout</button>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/*" element={
              <ProtectedRoute>
                <>
                  <HeaderWrapper />
                  <NavBar />
                  <Routes>
                    <Route path="/" element={<DoctorInterface />} />
                    <Route path="/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/patients" element={<PatientList />} />
                  </Routes>
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
