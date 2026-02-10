
import { GoogleGenAI } from "@google/genai";
import { Patient } from "../types";

export const generatePatientReport = async (patient: Patient): Promise<string> => {
  // Always use a new instance with the latest API key from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze the following patient data for a diagnosis of Sandhigata Vata (Osteoarthritis).
    
    Patient Name: ${patient.demographics.name}
    Age: ${patient.demographics.age}
    Gender: ${patient.demographics.gender}
    Occupation: ${patient.demographics.occupation}
    
    Symptoms Assessment:
    1. Joint Pain: ${patient.symptoms.hasJointPain} (VAS: ${patient.symptoms.painIntensity}/10, Duration: ${patient.symptoms.painDuration}, Onset: ${patient.symptoms.painOnset})
    2. Pain Type: ${patient.symptoms.painTypes.join(', ')}
    3. Swelling: ${patient.symptoms.swelling} (Duration: ${patient.symptoms.swellingDuration})
    4. Stiffness: ${patient.symptoms.stiffness} (${patient.symptoms.stiffnessDuration})
    5. Crepitus: ${patient.symptoms.crepitus}
    6. Shifting Pain: ${patient.symptoms.shiftingPain}
    7. Warmth: ${patient.symptoms.warmth}
    8. Fever: ${patient.symptoms.fever}
    9. Discoloration: ${patient.symptoms.discoloration}
    10. Effect of Oil/Massage: ${patient.symptoms.oilMassageEffect}
    
    11. Affected Joints: ${patient.affectedJoints.join(', ')}
    
    Lab Results:
    - ESR: ${patient.labs.esr || 'N/A'}
    - RA Factor: ${patient.labs.raFactor || 'N/A'}
    - Uric Acid: ${patient.labs.uricAcid || 'N/A'}
    
    Please provide a concise clinical summary, severity assessment, and general Ayurvedic dietary (Pathya/Apathya) and lifestyle recommendations based on the specific symptoms reported.
    Format the response in Markdown.
  `;

  try {
    // Using gemini-3-pro-preview for complex clinical reasoning tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Ayurvedic practitioner and Rheumatologist. Provide accurate clinical analysis and recommendations.",
        thinkingConfig: { thinkingBudget: 4096 }
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error generating report. Please try again later.";
  }
};
