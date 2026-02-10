import React, { useState, useEffect } from 'react';
import { Patient, AppView } from './types';
import { getPatients, savePatient, deletePatient, deletePatients } from './services/storageService';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import PatientDetail from './components/PatientDetail';

function App() {
  const [view, setView] = useState<AppView>(AppView.LIST);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Load patients on mount
  useEffect(() => {
    refreshPatients();
  }, []);

  const refreshPatients = () => {
    const list = getPatients();
    setPatients([...list]);
  };

  const handleSavePatient = (patient: Patient) => {
    savePatient(patient);
    refreshPatients();
    setView(AppView.LIST);
  };

  const handleDeletePatient = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this patient record?')) {
      // Log for debugging in browser console
      console.log('[App] Deleting patient', id);

      // Use deletePatients helper for consistent behavior
      deletePatients([id]);

      // Immediately update local state for fast UI response
      setPatients(prev => prev.filter(p => p.id !== id));

      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
        setView(AppView.LIST);
      }

      // Final sync with storage
      refreshPatients();
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setView(AppView.PATIENT_DETAIL);
  };

  const handleNewPatient = () => {
    setView(AppView.NEW_PATIENT);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView(AppView.LIST)}>
               <div className="w-8 h-8 bg-ayur-600 rounded-lg flex items-center justify-center mr-2">
                   <span className="text-white font-bold text-xl">S</span>
               </div>
               <span className="text-xl font-bold text-gray-800 tracking-tight">Sandhigata<span className="text-ayur-600">Vata</span></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-6">
        {view === AppView.LIST && (
            <PatientList 
                patients={patients} 
                onSelect={handleSelectPatient} 
                onDelete={handleDeletePatient}
                onNew={handleNewPatient}
            />
        )}

        {view === AppView.NEW_PATIENT && (
            <PatientForm 
                onSave={handleSavePatient}
                onCancel={() => setView(AppView.LIST)}
            />
        )}

        {view === AppView.PATIENT_DETAIL && selectedPatient && (
            <PatientDetail 
                patient={selectedPatient}
                onBack={() => setView(AppView.LIST)}
            />
        )}
      </main>
    </div>
  );
}

export default App;