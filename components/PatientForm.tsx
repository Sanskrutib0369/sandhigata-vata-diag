
import React, { useState } from 'react';
import { Patient, Demographics, SymptomAssessment, LabInvestigations } from '../types';
import VasScale from './VasScale';
import BodyMap from './BodyMap';
import { Save, ArrowRight, ArrowLeft, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { diagnoseSandhigataVata } from '../services/diagnosisService';

interface PatientFormProps {
  onSave: (patient: Patient) => void;
  onCancel: () => void;
}

const INITIAL_DEMO: Demographics = {
  name: '', age: '', gender: '', address: '', occupation: '', opdIpdNo: '', contact: ''
};

const INITIAL_SYMPTOMS: SymptomAssessment = {
  hasJointPain: '',
  painDuration: '',
  painIntensity: 0,
  painOnset: '',
  painTypes: [],
  swelling: '',
  swellingDuration: '',
  stiffness: '',
  stiffnessDuration: '',
  crepitus: '',
  shiftingPain: '',
  warmth: '',
  fever: '',
  discoloration: '',
  oilMassageEffect: ''
};

const PatientForm: React.FC<PatientFormProps> = ({ onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [demographics, setDemographics] = useState<Demographics>(INITIAL_DEMO);
  const [symptoms, setSymptoms] = useState<SymptomAssessment>(INITIAL_SYMPTOMS);
  const [joints, setJoints] = useState<string[]>([]);
  const [labs, setLabs] = useState<LabInvestigations>({});
  
  // State for result modal
  const [showResult, setShowResult] = useState(false);
  const [savedPatient, setSavedPatient] = useState<Patient | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<{isPositive: boolean, reasons: string[]} | null>(null);

  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setDemographics({ ...demographics, [e.target.name]: e.target.value });
  };

  const handleLabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabs({ ...labs, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
             setLabs(prev => ({ ...prev, xrayImage: reader.result as string, xrayReport: file.name }));
         };
         reader.readAsDataURL(file);
     }
  };

  const handlePreSave = () => {
    const newPatient: Patient = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      demographics,
      symptoms,
      affectedJoints: joints,
      labs
    };
    
    // Run diagnosis immediately
    const result = diagnoseSandhigataVata(newPatient);
    setSavedPatient(newPatient);
    setDiagnosisResult(result);
    setShowResult(true);
  };

  const confirmSaveAndExit = () => {
      if (savedPatient) {
          onSave(savedPatient);
      }
  };

  const togglePainType = (type: string) => {
    if (symptoms.painTypes.includes(type)) {
      setSymptoms({ ...symptoms, painTypes: symptoms.painTypes.filter(t => t !== type) });
    } else {
      setSymptoms({ ...symptoms, painTypes: [...symptoms.painTypes, type] });
    }
  };

  // Common input style for Demographics (Black columns with white text)
  const demoInputStyle = "w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-ayur-400 outline-none placeholder-gray-500 transition-all";
  const demoLabelStyle = "block text-sm font-semibold text-gray-700 mb-1";

  if (showResult && diagnosisResult) {
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
                  <div className={`p-8 text-center ${diagnosisResult.isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
                      {diagnosisResult.isPositive ? (
                          <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4 animate-bounce-short">
                              <CheckCircle className="w-12 h-12 text-green-600" />
                          </div>
                      ) : (
                          <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4 animate-shake">
                              <XCircle className="w-12 h-12 text-red-600" />
                          </div>
                      )}
                      
                      <h2 className={`text-3xl font-bold mb-2 ${diagnosisResult.isPositive ? 'text-green-800' : 'text-red-800'}`}>
                          {diagnosisResult.isPositive ? 'Diagnosed Positive' : 'Not Diagnosed'}
                      </h2>
                      <p className={`text-lg font-medium ${diagnosisResult.isPositive ? 'text-green-700' : 'text-red-700'}`}>
                          {diagnosisResult.isPositive ? 'Sandhigata Vata Confirmed' : 'Not Sandhigata Vata'}
                      </p>
                  </div>

                  <div className="p-6">
                      {!diagnosisResult.isPositive && diagnosisResult.reasons.length > 0 && (
                          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase">Reasons for negative diagnosis:</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                  {diagnosisResult.reasons.map((r, i) => (
                                      <li key={i}>{r}</li>
                                  ))}
                              </ul>
                          </div>
                      )}
                      
                      <button 
                        onClick={confirmSaveAndExit}
                        className="w-full py-3 bg-ayur-600 hover:bg-ayur-700 text-white rounded-xl font-bold text-lg shadow-lg transition-transform transform hover:scale-[1.02] active:scale-95"
                      >
                          Save Record & Finish
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto my-6 border border-gray-100">
      {/* Header Stepper */}
      <div className="bg-ayur-50 p-6 border-b border-ayur-100">
        <h2 className="text-2xl font-bold text-ayur-800 mb-4">New Patient Diagnosis</h2>
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex items-center ${s !== 4 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-ayur-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              {s !== 4 && <div className={`h-1 flex-1 mx-2 rounded ${step > s ? 'bg-ayur-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs mt-2 text-gray-500 font-medium">
            <span>Demographics</span>
            <span>Questionnaire</span>
            <span>Joint Map</span>
            <span>Labs</span>
        </div>
      </div>

      <div className="p-6 min-h-[400px]">
        {/* Step 1: Demographics */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <div className="col-span-2">
                <label className={demoLabelStyle}>Full Name</label>
                <input required type="text" name="name" value={demographics.name} onChange={handleDemoChange} className={demoInputStyle} placeholder="Enter patient name" />
            </div>
            <div>
                <label className={demoLabelStyle}>Age</label>
                <input required type="number" name="age" value={demographics.age} onChange={handleDemoChange} className={demoInputStyle} placeholder="e.g. 65" />
            </div>
            <div>
                <label className={demoLabelStyle}>Gender</label>
                <select name="gender" value={demographics.gender} onChange={handleDemoChange} className={demoInputStyle}>
                    <option value="" className="bg-gray-900">Select Gender</option>
                    <option value="Male" className="bg-gray-900">Male</option>
                    <option value="Female" className="bg-gray-900">Female</option>
                    <option value="Other" className="bg-gray-900">Other</option>
                </select>
            </div>
            <div className="col-span-2">
                <label className={demoLabelStyle}>Address</label>
                <input type="text" name="address" value={demographics.address} onChange={handleDemoChange} className={demoInputStyle} placeholder="Residential Address" />
            </div>
            <div>
                <label className={demoLabelStyle}>Occupation</label>
                <input type="text" name="occupation" value={demographics.occupation} onChange={handleDemoChange} className={demoInputStyle} placeholder="e.g. Farmer, Desk Job" />
            </div>
             <div className="col-span-1">
                <label className={demoLabelStyle}>Contact No.</label>
                <input type="text" name="contact" value={demographics.contact} onChange={handleDemoChange} className={demoInputStyle} placeholder="Phone Number" />
            </div>
            <div className="col-span-1">
                <label className={demoLabelStyle}>OPD/IPD No.</label>
                <input type="text" name="opdIpdNo" value={demographics.opdIpdNo} onChange={handleDemoChange} className={demoInputStyle} placeholder="Hospital Record No." />
            </div>
          </div>
        )}

        {/* Step 2: Questionnaire (Questions 1-10) */}
        {step === 2 && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            
            {/* Q1 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-lg font-bold text-gray-800 mb-3">1. Do you experience joint pain?</label>
                <div className="flex space-x-6 mb-4">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="jointPain" value="Yes" checked={symptoms.hasJointPain === 'Yes'} onChange={() => setSymptoms({...symptoms, hasJointPain: 'Yes'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="jointPain" value="No" checked={symptoms.hasJointPain === 'No'} onChange={() => setSymptoms({...symptoms, hasJointPain: 'No'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">No</span>
                    </label>
                </div>
                
                {symptoms.hasJointPain === 'Yes' && (
                    <div className="pl-4 border-l-4 border-ayur-200 space-y-4 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Since (Time)</label>
                            <input type="text" value={symptoms.painDuration} onChange={(e) => setSymptoms({...symptoms, painDuration: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. 2 months" />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Onset</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center cursor-pointer">
                                    <input type="radio" name="onset" value="Sudden" checked={symptoms.painOnset === 'Sudden'} onChange={() => setSymptoms({...symptoms, painOnset: 'Sudden'})} className="w-4 h-4 text-ayur-600" />
                                    <span className="ml-2">Sudden</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input type="radio" name="onset" value="Gradual" checked={symptoms.painOnset === 'Gradual'} onChange={() => setSymptoms({...symptoms, painOnset: 'Gradual'})} className="w-4 h-4 text-ayur-600" />
                                    <span className="ml-2">Gradual</span>
                                </label>
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-600 mb-2">Intensity</label>
                             <VasScale value={symptoms.painIntensity} onChange={(v) => setSymptoms({...symptoms, painIntensity: v})} />
                        </div>
                    </div>
                )}
            </div>

            {/* Q2 */}
            {symptoms.hasJointPain === 'Yes' && (
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 animate-fadeIn">
                    <label className="block text-lg font-bold text-gray-800 mb-3">2. If Yes, which type of pain do you feel?</label>
                    <div className="space-y-2">
                        {['Burning / Stinging Pain', 'Biting Pain', 'Pain during flexion & extension'].map(type => (
                            <label key={type} className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={symptoms.painTypes.includes(type)} 
                                    onChange={() => togglePainType(type)} 
                                    className="w-5 h-5 text-ayur-600 rounded" 
                                />
                                <span className="ml-2">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Q3 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-lg font-bold text-gray-800 mb-3">3. Is there swelling in joints?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        {['Always', 'Occasionally', 'Never'].map(opt => (
                            <label key={opt} className="flex items-center cursor-pointer">
                                <input type="radio" name="swelling" value={opt} checked={symptoms.swelling === opt} onChange={() => setSymptoms({...symptoms, swelling: opt as any})} className="w-5 h-5 text-ayur-600" />
                                <span className="ml-2">{opt}</span>
                            </label>
                        ))}
                    </div>
                    {symptoms.swelling && symptoms.swelling !== 'Never' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Since (Time)</label>
                            <input type="text" value={symptoms.swellingDuration} onChange={(e) => setSymptoms({...symptoms, swellingDuration: e.target.value})} className="w-full p-2 border rounded" placeholder="e.g. 2 weeks" />
                        </div>
                    )}
                </div>
            </div>

            {/* Q4 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-lg font-bold text-gray-800 mb-3">4. Do your joints feel stiff, especially after rest or in the morning?</label>
                <div className="flex space-x-6 mb-4">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="stiffness" value="Yes" checked={symptoms.stiffness === 'Yes'} onChange={() => setSymptoms({...symptoms, stiffness: 'Yes'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="stiffness" value="No" checked={symptoms.stiffness === 'No'} onChange={() => setSymptoms({...symptoms, stiffness: 'No'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">No</span>
                    </label>
                </div>
                {symptoms.stiffness === 'Yes' && (
                    <div className="pl-4 border-l-4 border-ayur-200 space-y-2 animate-fadeIn">
                        <label className="flex items-center cursor-pointer">
                             {/* Fix: Corrected property name and added symptoms object to spread */}
                             <input type="radio" name="stiffnessDur" value="Less than 1Hr" checked={symptoms.stiffnessDuration === 'Less than 1Hr'} onChange={() => setSymptoms({...symptoms, stiffnessDuration: 'Less than 1Hr'})} className="w-4 h-4 text-ayur-600" />
                             <span className="ml-2">Less than 1 Hour</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                             <input type="radio" name="stiffnessDur" value="More than 1Hr" checked={symptoms.stiffnessDuration === 'More than 1Hr'} onChange={() => setSymptoms({...symptoms, stiffnessDuration: 'More than 1Hr'})} className="w-4 h-4 text-ayur-600" />
                             <span className="ml-2">More than 1 Hour</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Q5 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-lg font-bold text-gray-800 mb-3">5. Is there a crepitus or cracking sound during movement of joints?</label>
                <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="crepitus" value="Yes" checked={symptoms.crepitus === 'Yes'} onChange={() => setSymptoms({...symptoms, crepitus: 'Yes'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="crepitus" value="No" checked={symptoms.crepitus === 'No'} onChange={() => setSymptoms({...symptoms, crepitus: 'No'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">No</span>
                    </label>
                </div>
            </div>

            {/* Q6 */}
             <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-lg font-bold text-gray-800 mb-3">6. Does pain and swelling that you have shifts from one joint to another?</label>
                <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="shifting" value="Yes" checked={symptoms.shiftingPain === 'Yes'} onChange={() => setSymptoms({...symptoms, shiftingPain: 'Yes'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="shifting" value="No" checked={symptoms.shiftingPain === 'No'} onChange={() => setSymptoms({...symptoms, shiftingPain: 'No'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">No</span>
                    </label>
                </div>
            </div>

            {/* Q7 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-lg font-bold text-gray-800 mb-3">7. Does your affected joints feel warm to touch?</label>
                <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="warmth" value="Yes" checked={symptoms.warmth === 'Yes'} onChange={() => setSymptoms({...symptoms, warmth: 'Yes'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="warmth" value="No" checked={symptoms.warmth === 'No'} onChange={() => setSymptoms({...symptoms, warmth: 'No'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">No</span>
                    </label>
                </div>
            </div>

            {/* Q8 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-lg font-bold text-gray-800 mb-3">8. Do you get fever episodes along with joint symptoms?</label>
                <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="fever" value="Yes" checked={symptoms.fever === 'Yes'} onChange={() => setSymptoms({...symptoms, fever: 'Yes'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="fever" value="No" checked={symptoms.fever === 'No'} onChange={() => setSymptoms({...symptoms, fever: 'No'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">No</span>
                    </label>
                </div>
            </div>

            {/* Q9 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-lg font-bold text-gray-800 mb-3">9. Have you noticed skin discoloration (reddish or purplish) over painful joints?</label>
                <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="discoloration" value="Yes" checked={symptoms.discoloration === 'Yes'} onChange={() => setSymptoms({...symptoms, discoloration: 'Yes'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input type="radio" name="discoloration" value="No" checked={symptoms.discoloration === 'No'} onChange={() => setSymptoms({...symptoms, discoloration: 'No'})} className="w-5 h-5 text-ayur-600" />
                        <span className="ml-2 font-medium">No</span>
                    </label>
                </div>
            </div>

            {/* Q10 */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-lg font-bold text-gray-800 mb-3">10. What do you feel after applying oil or massage to the painful joint?</label>
                <div className="space-y-2">
                    {[
                        'Pain reduces and movement improves', 
                        'No change', 
                        'Pain increases after oil or massage',
                        "I haven't tried oil or massage"
                    ].map(opt => (
                         <label key={opt} className="flex items-center cursor-pointer">
                            <input type="radio" name="oilEffect" value={opt} checked={symptoms.oilMassageEffect === opt} onChange={() => setSymptoms({...symptoms, oilMassageEffect: opt})} className="w-5 h-5 text-ayur-600" />
                            <span className="ml-2">{opt}</span>
                        </label>
                    ))}
                </div>
            </div>

          </div>
        )}

        {/* Step 3: Body Map (Question 11) */}
        {step === 3 && (
            <div className="flex flex-col items-center animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-800 mb-4">11. Which Joints are affected?</h3>
                <BodyMap selectedJoints={joints} onChange={setJoints} />
                <div className="mt-4 w-full max-w-md text-center">
                     <h4 className="font-semibold text-gray-700 mb-2">Selected Joints:</h4>
                     <div className="flex flex-wrap gap-2 justify-center">
                        {joints.length === 0 && <span className="text-gray-400 italic">No joints selected</span>}
                        {joints.map(j => (
                            <span key={j} className="bg-ayur-100 text-ayur-800 px-3 py-1 rounded-full text-sm font-medium border border-ayur-200">
                                {j}
                            </span>
                        ))}
                     </div>
                </div>
            </div>
        )}

        {/* Step 4: Labs */}
        {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['CBC', 'ESR', 'CRP', 'RA Factor', 'Uric Acid', 'Serum Calcium'].map((lab) => {
                         const key = lab.toLowerCase().replace(/\s/g, '') === 'rafactor' ? 'raFactor' : lab.toLowerCase().replace(/\s/g, ''); 
                         // Simple mapping key generation for demo
                         const actualKey = key === 'cbc' ? 'cbc' : key === 'esr' ? 'esr' : key === 'crp' ? 'crp' : key === 'rafactor' ? 'raFactor' : key === 'uricacid' ? 'uricAcid' : key === 'serumcalcium' ? 'serumCalcium' : 'other';

                         return (
                            <div key={lab}>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{lab}</label>
                                <input 
                                    type="text" 
                                    name={actualKey}
                                    value={(labs as any)[actualKey] || ''}
                                    onChange={handleLabChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:border-ayur-500 outline-none" 
                                    placeholder="Result" 
                                />
                            </div>
                         );
                    })}
                 </div>

                 <div className="border-t pt-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2"/> X-Ray Report / Image
                    </label>
                    <div className="flex items-center space-x-4">
                        <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                            <Upload className="w-5 h-5 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">Upload Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                        {labs.xrayReport && <span className="text-sm text-ayur-700 font-medium">{labs.xrayReport}</span>}
                    </div>
                    {labs.xrayImage && (
                        <div className="mt-4">
                            <img src={labs.xrayImage} alt="Xray Preview" className="h-32 rounded border shadow-sm object-cover" />
                        </div>
                    )}
                 </div>
            </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center">
        {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </button>
        ) : (
            <button onClick={onCancel} className="px-4 py-2 text-red-500 hover:text-red-700 font-medium transition-colors">
                Cancel
            </button>
        )}

        {step < 4 ? (
            <button 
                onClick={() => setStep(step + 1)} 
                disabled={step === 1 && !demographics.name}
                className={`flex items-center px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all ${step === 1 && !demographics.name ? 'bg-gray-400 cursor-not-allowed' : 'bg-ayur-600 hover:bg-ayur-700'}`}
            >
                Next <ArrowRight className="w-5 h-5 ml-2" />
            </button>
        ) : (
            <button onClick={handlePreSave} className="flex items-center px-6 py-2 bg-ayur-600 hover:bg-ayur-700 text-white rounded-lg font-bold shadow-md transition-colors">
                <Save className="w-5 h-5 mr-2" /> Save Record
            </button>
        )}
      </div>
    </div>
  );
};

export default PatientForm;
