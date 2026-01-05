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

import { validatePrescription, analyzeBloodReport, analyzeMRI } from './utils/gemini';
import { AlertTriangle, FileText, Check } from 'lucide-react';

function DoctorInterface() {
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    date: new Date().toISOString().split('T')[0],
    symptoms: ''
  });
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bloodReportResult, setBloodReportResult] = useState(null);
  const [isAnalyzingMRI, setIsAnalyzingMRI] = useState(false);
  const [mriResult, setMriResult] = useState(null);

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
      setPatientData({
        name: '',
        age: '',
        gender: '',
        date: new Date().toISOString().split('T')[0],
        symptoms: ''
      });
      setDiagnosis('');
      setMedicines([]);
      setValidationResult(null);
      setBloodReportResult(null);
      setMriResult(null);
    }
  };

  const handleValidate = async () => {
    if (!patientData.age || medicines.length === 0) {
      alert("Please enter patient age and add medicines to validate.");
      return;
    }
    setIsValidating(true);
    setValidationResult(null);
    const result = await validatePrescription(
      patientData.age,
      medicines,
      patientData.symptoms,
      diagnosis
    );
    setValidationResult(result);
    setIsValidating(false);
  };

  const handleBloodReportUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAnalyzing(true);
    setBloodReportResult(null);
    const result = await analyzeBloodReport(file);
    setBloodReportResult(result);
    setIsAnalyzing(false);
  };

  const handleMRIUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAnalyzingMRI(true);
    setMriResult(null);
    const result = await analyzeMRI(file);
    setMriResult(result);
    setIsAnalyzingMRI(false);
  };


  return (
    <div className="container main-content" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      {/* Helper Nav/Actions */}
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-2xl font-bold text-slate-800">New Prescription</h2>
        <div className="flex gap-2">
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="btn btn-secondary flex items-center gap-2"
            style={{ borderColor: '#6366f1', color: '#6366f1' }}
          >
            {isValidating ? 'Validating...' : 'Validate Prescription'}
          </button>
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

      {/* Validation Result Alert */}
      {validationResult && (
        <div className={`border px-4 py-3 rounded relative mb-4 no-print ${validationResult.error ? 'bg-red-100 border-red-400 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <strong className="font-bold block mb-1">
            {validationResult.error ? <AlertTriangle size={18} className="inline mr-2" /> : "Gemini Validation:"}
          </strong>
          <div className="text-sm whitespace-pre-wrap">
            {validationResult.error || validationResult.text}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="no-print space-y-6">
          <PatientDetailsForm data={patientData} onChange={setPatientData} />

          {/* Blood Report Analysis Section */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText size={20} className="text-slate-500" />
              Blood Report Challenge
            </h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Upload Report Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleBloodReportUpload}
                  className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-cyan-50 file:text-cyan-700
                            hover:file:bg-cyan-100"
                />
                {isAnalyzing && <div className="text-sm text-slate-500 animate-pulse">Analyzing...</div>}
              </div>
            </div>

            {bloodReportResult && (
              <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-1">Gemini Analysis Verdict:</h4>
                <div className="text-sm text-slate-600 whitespace-pre-wrap">
                  {bloodReportResult.error || bloodReportResult.text}
                </div>
              </div>
            )}
          </div>

          {/* MRI Scan Analysis Section */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <div className="p-1 bg-indigo-100 rounded">
                <FileText size={20} className="text-indigo-600" />
              </div>
              MRI Scan Anomaly Detection
            </h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Upload MRI Scan</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMRIUpload}
                  className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                />
                {isAnalyzingMRI && <div className="text-sm text-slate-500 animate-pulse">Scanning...</div>}
              </div>
            </div>

            {mriResult && (
              <div className="mt-4 p-3 bg-indigo-50 rounded border border-indigo-200">
                <h4 className="text-sm font-bold text-indigo-800 mb-1">MRI Analysis Findings:</h4>
                <div className="text-sm text-indigo-900 whitespace-pre-wrap">
                  {mriResult.error || mriResult.text}
                </div>
              </div>
            )}
          </div>

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
