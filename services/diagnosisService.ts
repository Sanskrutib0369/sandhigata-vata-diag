import { Patient } from '../types';

export interface DiagnosisResult {
  isPositive: boolean;
  criteria: {
    jointPain: boolean;
    onset: boolean;
    painType: boolean;
    swelling: boolean;
    stiffness: boolean;
    crepitus: boolean;
    shiftingPain: boolean;
    warmth: boolean;
    fever: boolean;
    discoloration: boolean;
    oilEffect: boolean;
    affectedJoints: boolean;
  };
  reasons: string[];
}

export const checkCriteria = (patient: Patient): DiagnosisResult => {
  const s = patient.symptoms;
  const joints = patient.affectedJoints;

  const criteria = {
    // 1. Joint Pain: Must be 'Yes'
    jointPain: s.hasJointPain === 'Yes',
    
    // 1b. Onset: Must be 'Gradual' (Only relevant if pain exists, but strict rule says Gradual)
    onset: s.painOnset === 'Gradual',
    
    // 2. Pain Type: Must include 'Pain during flexion & extension'
    painType: s.painTypes.includes('Pain during flexion & extension'),
    
    // 3. Swelling: Must be 'Always' OR 'Occasionally'
    swelling: s.swelling === 'Always' || s.swelling === 'Occasionally',
    
    // 4. Stiffness: 'No' is OK. If 'Yes', must be 'Less than 1Hr'.
    stiffness: s.stiffness === 'No' || (s.stiffness === 'Yes' && s.stiffnessDuration === 'Less than 1Hr'),
    
    // 5. Crepitus: Must be 'Yes'
    crepitus: s.crepitus === 'Yes',
    
    // 6. Shifting Pain: Must be 'No'
    shiftingPain: s.shiftingPain === 'No',
    
    // 7. Warmth: Must be 'No'
    warmth: s.warmth === 'No',
    
    // 8. Fever: Must be 'No'
    fever: s.fever === 'No',
    
    // 9. Discoloration: Must be 'No'
    discoloration: s.discoloration === 'No',
    
    // 10. Oil/Massage Effect: Must NOT be 'Pain increases...'
    oilEffect: s.oilMassageEffect !== 'Pain increases after oil or massage',
    
    // 11. Affected Joints: Must include Knee, Spine, or Hip
    affectedJoints: joints.some(j => {
      const lower = j.toLowerCase();
      return lower.includes('knee') || lower.includes('spine') || lower.includes('hip') || 
             lower.includes('lumbar') || lower.includes('cervical'); // Lumbar/Cervical are spine
    })
  };

  const reasons: string[] = [];
  if (!criteria.jointPain) reasons.push("Joint pain absent.");
  if (!criteria.onset) reasons.push("Onset is not Gradual.");
  if (!criteria.painType) reasons.push("Pain during flexion & extension not reported.");
  if (!criteria.swelling) reasons.push("Swelling is not Always or Occasionally.");
  if (!criteria.stiffness) reasons.push("Stiffness > 1hr.");
  if (!criteria.crepitus) reasons.push("Crepitus absent.");
  if (!criteria.shiftingPain) reasons.push("Shifting pain present.");
  if (!criteria.warmth) reasons.push("Warmth present.");
  if (!criteria.fever) reasons.push("Fever present.");
  if (!criteria.discoloration) reasons.push("Discoloration present.");
  if (!criteria.oilEffect) reasons.push("Pain increases after oil.");
  if (!criteria.affectedJoints) reasons.push("Knee, Spine, or Hip not involved.");

  const isPositive = Object.values(criteria).every(v => v === true);

  return { isPositive, criteria, reasons };
};

// Wrapper for simple use cases
export const diagnoseSandhigataVata = (patient: Patient): { isPositive: boolean; reasons: string[] } => {
  const result = checkCriteria(patient);
  return { isPositive: result.isPositive, reasons: result.reasons };
};
