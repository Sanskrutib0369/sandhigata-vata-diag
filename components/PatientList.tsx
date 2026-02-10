import React from 'react';
import { Patient } from '../types';
import { User, Calendar, Activity, ChevronRight, Trash2 } from 'lucide-react';
import { diagnoseSandhigataVata } from '../services/diagnosisService';

interface PatientListProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onSelect, onDelete, onNew }) => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-ayur-900">Patient Records</h1>
            <p className="text-gray-500 mt-1">Diagnosing Sandhigata Vata</p>
        </div>
        <button 
            onClick={onNew}
            className="bg-ayur-600 hover:bg-ayur-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center font-semibold transition-all hover:scale-105"
        >
            <span className="text-xl mr-2">+</span> New Diagnosis
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-ayur-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-ayur-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">No records found</h3>
            <p className="text-gray-500 mb-6">Start by adding a new patient for diagnosis.</p>
            <button onClick={onNew} className="text-ayur-600 font-bold hover:underline">Create First Record</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map(patient => {
                const diagnosis = diagnoseSandhigataVata(patient);
                return (
                <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-ayur-100 flex items-center justify-center text-ayur-700 font-bold">
                                    {patient.demographics.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 truncate max-w-[150px]">{patient.demographics.name}</h3>
                                    <p className="text-xs text-gray-500">{patient.demographics.age} Y • {patient.demographics.gender}</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                                {patient.demographics.opdIpdNo || 'OPD'}
                            </span>
                        </div>
                        
                        <div className="mb-4">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full border ${diagnosis.isPositive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {diagnosis.isPositive ? 'POSITIVE' : 'NEGATIVE'}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {new Date(patient.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Activity className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="truncate">Pain VAS: <span className={`font-bold ${patient.symptoms.painIntensity > 5 ? 'text-red-500' : 'text-green-600'}`}>{patient.symptoms.painIntensity}/10</span></span>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                            {patient.affectedJoints.slice(0, 3).map(j => (
                                <span key={j} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{j}</span>
                            ))}
                            {patient.affectedJoints.length > 3 && <span className="text-[10px] text-gray-400 pl-1">+{patient.affectedJoints.length - 3} more</span>}
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                         <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(patient.id); }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => onSelect(patient)}
                            className="text-ayur-600 text-sm font-bold flex items-center group-hover:translate-x-1 transition-transform"
                        >
                            View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>
            )})}
        </div>
      )}
    </div>
  );
};

export default PatientList;
