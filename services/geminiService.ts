import { Patient } from "../types";

export const generatePatientReport = async (patient: Patient): Promise<string> => {

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

Affected Joints: ${patient.affectedJoints.join(', ')}

Lab Results:
- ESR: ${patient.labs.esr || 'N/A'}
- RA Factor: ${patient.labs.raFactor || 'N/A'}
- Uric Acid: ${patient.labs.uricAcid || 'N/A'}

Provide a concise clinical summary, severity assessment, and general Ayurvedic dietary and lifestyle recommendations.
Format response in Markdown.
`;

  try {
    const response = await fetch(
      "https://sandhigata-ai-backend.onrender.com/api/gemini",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI error");
    }

    return data.result;
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error generating report. Please try again later.";
  }
};
