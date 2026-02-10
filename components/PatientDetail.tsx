import React, { useState } from 'react';
import { Patient } from '../types';
import BodyMap from './BodyMap';
import VasScale from './VasScale';
import { ArrowLeft, User, Printer, Cpu, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { generatePatientReport } from '../services/geminiService';
import { checkCriteria } from '../services/diagnosisService';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Run diagnosis algorithm to get detailed criteria checks
  const diagnosis = checkCriteria(patient);

  const handleGenerateReport = async () => {
    setLoading(true);
    const report = await generatePatientReport(patient);
    setAiReport(report);
    setLoading(false);
  };

  const DetailRow = ({ label, value, isValid }: { label: string, value: string | undefined, isValid?: boolean }) => (
    <div className={`p-4 rounded-lg border ${isValid === false ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
        <span className="block text-xs text-gray-500 uppercase font-bold mb-1">{label}</span>
        <span className={`text-md font-medium ${isValid === false ? 'text-red-700' : 'text-gray-800'}`}>
            {value || 'N/A'} {isValid === false && "(Invalid)"}
        </span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-6 flex items-center text-gray-500 hover:text-ayur-600 transition-colors font-medium">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-ayur-600 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
                <h1 className="text-3xl font-bold mb-2">{patient.demographics.name}</h1>
                <div className="flex flex-wrap gap-4 text-ayur-100 text-sm">
                    <span className="flex items-center"><User className="w-4 h-4 mr-1"/> {patient.demographics.age} Years, {patient.demographics.gender}</span>
                    <span className="opacity-75">ID: {patient.demographics.opdIpdNo || 'N/A'}</span>
                    <span className="opacity-75">Date: {new Date(patient.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <button onClick={() => window.print()} className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm flex items-center text-sm font-semibold transition-colors">
                <Printer className="w-4 h-4 mr-2" /> Print Record
            </button>
        </div>

        {/* Diagnostic Result Banner */}
        <div className={`p-6 border-b ${diagnosis.isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start">
                {diagnosis.isPositive ? (
                    <CheckCircle className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                ) : (
                    <XCircle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
                )}
                <div className="ml-4">
                    <h2 className={`text-xl font-bold ${diagnosis.isPositive ? 'text-green-800' : 'text-red-800'}`}>
                        {diagnosis.isPositive ? "Positive for Sandhigata Vata" : "Negative for Sandhigata Vata"}
                    </h2>
                    <p className={`text-sm mt-1 ${diagnosis.isPositive ? 'text-green-700' : 'text-red-700'}`}>
                        {diagnosis.isPositive 
                            ? "All strict diagnostic criteria for Sandhigata Vata are met."
                            : "The patient does not meet all criteria. Failed criteria are highlighted in red below."}
                    </p>
                    {!diagnosis.isPositive && diagnosis.reasons.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs font-bold text-red-800 uppercase mb-1">Unmet Criteria Summary:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                {diagnosis.reasons.map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left Column: Clinical Info */}
            <div className="lg:col-span-2 p-6 md:p-8 space-y-8">
                
                {/* Questionnaire Data */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Questionnaire Responses</h2>
                    
                    {/* Q1 */}
                    <div className={`mb-6 p-4 rounded-lg border ${(!diagnosis.criteria.jointPain || !diagnosis.criteria.onset) ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                        <label className="text-sm font-semibold text-gray-500 mb-2 block">1. Pain Intensity</label>
                        <VasScale value={patient.symptoms.painIntensity} onChange={() => {}} readOnly />
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                             <div className={diagnosis.criteria.jointPain ? '' : 'text-red-600 font-bold'}>
                                 <span className="text-gray-500">Joint Pain:</span> {patient.symptoms.hasJointPain}
                             </div>
                             <div>
                                 <span className="text-gray-500">Duration:</span> {patient.symptoms.painDuration}
                             </div>
                             <div className={diagnosis.criteria.onset ? '' : 'text-red-600 font-bold'}>
                                 <span className="text-gray-500">Onset:</span> {patient.symptoms.painOnset}
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <DetailRow 
                            label="2. Type of Pain" 
                            value={patient.symptoms.painTypes.join(', ')} 
                            isValid={diagnosis.criteria.painType}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <DetailRow 
                                label="3. Swelling" 
                                value={`${patient.symptoms.swelling} ${patient.symptoms.swelling !== 'Never' ? `(Since: ${patient.symptoms.swellingDuration})` : ''}`} 
                                isValid={diagnosis.criteria.swelling}
                            />
                            <DetailRow 
                                label="4. Stiffness" 
                                value={`${patient.symptoms.stiffness} ${patient.symptoms.stiffness === 'Yes' ? `(${patient.symptoms.stiffnessDuration})` : ''}`} 
                                isValid={diagnosis.criteria.stiffness}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <DetailRow label="5. Crepitus" value={patient.symptoms.crepitus} isValid={diagnosis.criteria.crepitus} />
                             <DetailRow label="6. Shifting Pain" value={patient.symptoms.shiftingPain} isValid={diagnosis.criteria.shiftingPain} />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                             <DetailRow label="7. Warmth" value={patient.symptoms.warmth} isValid={diagnosis.criteria.warmth} />
                             <DetailRow label="8. Fever" value={patient.symptoms.fever} isValid={diagnosis.criteria.fever} />
                             <DetailRow label="9. Discoloration" value={patient.symptoms.discoloration} isValid={diagnosis.criteria.discoloration} />
                        </div>

                        <DetailRow label="10. Oil/Massage Effect" value={patient.symptoms.oilMassageEffect} isValid={diagnosis.criteria.oilEffect} />
                    </div>
                </section>

                {/* Labs Section */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Laboratory & Imaging</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {Object.entries(patient.labs).filter(([k]) => k !== 'xrayImage' && k !== 'xrayReport' && k !== 'other').map(([key, val]) => (
                            val && (
                                <div key={key} className="p-3 border rounded">
                                    <span className="block text-xs text-gray-500 uppercase font-bold mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="font-mono text-gray-800">{val}</span>
                                </div>
                            )
                        ))}
                    </div>
                    {patient.labs.xrayImage && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-600 mb-2">X-Ray Image</p>
                            <img src={patient.labs.xrayImage} alt="Xray" className="max-h-64 rounded-lg border shadow-sm" />
                            {patient.labs.xrayReport && <p className="text-xs text-gray-500 mt-2">File: {patient.labs.xrayReport}</p>}
                        </div>
                    )}
                </section>

                {/* AI Report Section */}
                <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                            <Cpu className="w-5 h-5 mr-2" /> AI Clinical Assistant
                        </h2>
                        {!aiReport && (
                            <button 
                                onClick={handleGenerateReport} 
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-all flex items-center disabled:opacity-70"
                            >
                                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin"/> : null}
                                {loading ? 'Analyzing...' : 'Generate Report'}
                            </button>
                        )}
                    </div>
                    
                    {loading && (
                        <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                            <div className="h-4 bg-indigo-200 rounded w-full"></div>
                            <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                        </div>
                    )}

                    {aiReport && (
                        <div className="prose prose-sm max-w-none text-gray-800 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm whitespace-pre-wrap font-sans">
                            {aiReport}
                        </div>
                    )}

                    {!aiReport && !loading && (
                        <p className="text-sm text-indigo-400 italic">
                            Click above to generate a diagnosis summary and Pathya/Apathya (diet) recommendations using Gemini AI.
                        </p>
                    )}
                     {!process.env.API_KEY && (
                         <div className="mt-2 flex items-center text-xs text-amber-600 bg-amber-50 p-2 rounded">
                            <AlertCircle className="w-3 h-3 mr-1" /> API Key not detected in environment. AI features may be disabled.
                         </div>
                     )}
                </section>
            </div>

            {/* Right Column: Body Map & Demographics */}
            <div className="bg-gray-50 border-l border-gray-200 p-6 md:p-8">
                <div className="mb-8">
                    <h3 className={`font-bold text-center mb-4 ${diagnosis.criteria.affectedJoints ? 'text-gray-700' : 'text-red-600'}`}>
                        Affected Joints (Q11)
                        {!diagnosis.criteria.affectedJoints && <span className="block text-xs font-normal mt-1">(Must include Knee, Spine, or Hip)</span>}
                    </h3>
                    <div className={`bg-white rounded-xl shadow-sm p-2 ${diagnosis.criteria.affectedJoints ? '' : 'border-2 border-red-300'}`}>
                        <BodyMap selectedJoints={patient.affectedJoints} onChange={() => {}} readOnly />
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Patient Details</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase">Address</span>
                            <span className="font-medium text-gray-800">{patient.demographics.address || 'N/A'}</span>
                        </li>
                         <li className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase">Occupation</span>
                            <span className="font-medium text-gray-800">{patient.demographics.occupation || 'N/A'}</span>
                        </li>
                        <li className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase">Contact</span>
                            <span className="font-medium text-gray-800">{patient.demographics.contact || 'N/A'}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
