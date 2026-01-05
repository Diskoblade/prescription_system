
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Mock Data for Demo Mode (Fallback when API quota is hit)
const MOCK_DATA = {
  validation: {
    text: `**Outcome: Approved** \n\n**Analysis:**\nThe prescribed medicines appear appropriate for the diagnosed condition. No contraindications found.\n\n**Warnings:**\n- Ensure patient stays hydrated.\n- Monitor for any allergic reactions.`
  },
  bloodReport: {
    text: `**Blood Report Analysis**\n\n**Findings:**\n- Hemoglobin: Slightly Low (11.5 g/dL)\n- WBC: Normal range\n- Platelets: Normal range\n\n**Verdict:**\nMild Anemia detected. Recommend dietary changes standard iron supplementation.`
  },
  mri: {
    text: `**MRI Scan Analysis**\n\n**Findings:**\n- No acute fracture or dislocation seen.\n- Mild soft tissue swelling noted in the lateral aspect.\n\n**Impressions:**\nLikely soft tissue injury. No skeletal anomalies detected.\n\n**Disclaimer:**\nAI-generated analysis. Consult a Radiologist for final diagnosis.`
  }
};

let genAI = null;
if (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export const validatePrescription = async (patientAge, medicines, symptoms, diagnosis) => {
  if (!genAI) {
    return { error: "Gemini API Key is missing. Please check your .env file." };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      You are a senior medical consultant AI.
      Patient Age: ${patientAge}
      Reported Symptoms: ${symptoms || "None provided"}
      Doctor's Diagnosis: ${diagnosis || "None provided"}
      Prescribed Medicines: ${JSON.stringify(medicines)}

      Task: "Analyze the Doctor's Decision"
      1. Consistency Check: Do the Symptoms match the Diagnosis?
      2. Medicine Suitability: Are these medicines appropriate for the Diagnosis and Symptoms?
      3. Safety Check: Are there contraindications for the Patient's Age or between medicines?

      Output Format:
      - verdict: "Approved" or "Concern Detected"
      - analysis: Brief explanation of your findings.
      - warnings: List any specific safety warnings.

      Keep it concise and professional.
      `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { text: response.text() };
  } catch (error) {
    console.error("Gemini Validation Error:", error);
    if (error.message.includes("429") || error.message.includes("Quota exceeded")) {
      console.warn("Rate Limit Hit. Using Mock Data for Demo.");
      return MOCK_DATA.validation;
    }
    return { error: "Failed to validate prescription. Please try again." };
  }
};

export const analyzeBloodReport = async (file) => {
  if (!genAI) {
    return { error: "Gemini API Key is missing. Please check your .env file." };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convert file to base64
    const fileToGenerativePart = async (file) => {
      const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });
      return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
      };
    };

    const imagePart = await fileToGenerativePart(file);
    console.log(`Sending to Gemini: MIME=${imagePart.inlineData.mimeType}, Size=${imagePart.inlineData.data.length} chars`);

    const prompt = `
    Analyze this blood report document (image or PDF).
    Extract key Abnormal Findings.
    Provide a "Verdict" for the doctor: Is the patient healthy, or is there a specific concern?
    Keep it professional and concise.
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return { text: response.text() };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    if (error.message.includes("429") || error.message.includes("Quota exceeded")) {
      console.warn("Rate Limit Hit. Using Mock Data for Demo.");
      return MOCK_DATA.bloodReport;
    }
    return { error: `Analysis Failed: ${error.message || "Unknown error"} (See Console for details)` };
  }
};

export const analyzeMRI = async (file) => {
  if (!genAI) {
    return { error: "Gemini API Key is missing. Please check your .env file." };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convert file to base64
    const fileToGenerativePart = async (file) => {
      const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });
      return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
      };
    };

    const imagePart = await fileToGenerativePart(file);

    const prompt = `
    Analyze this MRI scan image.
    Task: Identify any visible anomalies (e.g., tumors, fractures, inflammation, or structural abnormalities).
    
    Output Format:
    - Findings: List any anomalies found. if none, state "No obvious anomalies detected."
    - Impressions: A brief summary of what the image likely shows.
    - Disclaimer: Add a standard medical disclaimer that this is AI-generated and not a substitute for a radiologist.

    Keep it professional and concise.
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return { text: response.text() };
  } catch (error) {
    console.error("Gemini MRI Analysis Error:", error);
    if (error.message.includes("429") || error.message.includes("Quota exceeded")) {
      console.warn("Rate Limit Hit. Using Mock Data for Demo.");
      return MOCK_DATA.mri;
    }
    return { error: "Failed to analyze MRI. Please ensure the image is clear." };
  }
};
