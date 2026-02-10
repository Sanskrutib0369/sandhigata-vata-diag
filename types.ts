export interface Demographics {
  name: string;
  age: number | string;
  gender: 'Male' | 'Female' | 'Other' | '';
  address: string;
  occupation: string;
  opdIpdNo: string;
  contact: string;
}

export interface SymptomAssessment {
  // 1. Joint Pain
  hasJointPain: 'Yes' | 'No' | ''; // Using string for simple radio binding
  painDuration: string; // Since (Time)
  painIntensity: number; // VAS 0-10
  painOnset: 'Sudden' | 'Gradual' | '';

  // 2. Type of Pain
  painTypes: string[]; // Multi-select: Burning/Stinging, Biting, Flexion/Extension

  // 3. Swelling
  swelling: 'Always' | 'Occasionally' | 'Never' | '';
  swellingDuration: string; // Since (Time)

  // 4. Stiffness
  stiffness: 'Yes' | 'No' | '';
  stiffnessDuration: 'Less than 1Hr' | 'More than 1Hr' | '';

  // 5. Crepitus
  crepitus: 'Yes' | 'No' | '';

  // 6. Shifting Pain
  shiftingPain: 'Yes' | 'No' | '';

  // 7. Warmth
  warmth: 'Yes' | 'No' | '';

  // 8. Fever
  fever: 'Yes' | 'No' | '';

  // 9. Discoloration
  discoloration: 'Yes' | 'No' | '';

  // 10. Oil/Massage Effect
  oilMassageEffect: string; // "Pain reduces...", "No change", etc.
}

export interface LabInvestigations {
  cbc?: string;
  esr?: string;
  crp?: string;
  raFactor?: string;
  uricAcid?: string;
  serumCalcium?: string;
  other?: string;
  xrayReport?: string; // Text summary or filename
  xrayImage?: string; // Base64 data URL
}

export interface Patient {
  id: string;
  createdAt: string;
  demographics: Demographics;
  symptoms: SymptomAssessment;
  affectedJoints: string[];
  labs: LabInvestigations;
  notes?: string;
}

export enum AppView {
  LIST = 'LIST',
  NEW_PATIENT = 'NEW_PATIENT',
  PATIENT_DETAIL = 'PATIENT_DETAIL',
}
