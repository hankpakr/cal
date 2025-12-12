import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, MealInput, PredictionResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const apiKey = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey });

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        short_title: { type: Type.STRING },
        one_line_summary: { type: Type.STRING },
      },
    },
    prediction: {
      type: Type.OBJECT,
      properties: {
        expected_delta_mgdl_min: { type: Type.INTEGER },
        expected_delta_mgdl_max: { type: Type.INTEGER },
        confidence_level: { type: Type.STRING, enum: ["low", "medium", "high"] },
        reason_for_confidence: { type: Type.STRING },
        risk_level: { type: Type.STRING, enum: ["low", "moderate", "high"] },
        main_risk_factor: { type: Type.STRING },
      },
    },
    meal_analysis: {
      type: Type.OBJECT,
      properties: {
        estimated_carbs_grams: { type: Type.INTEGER },
        estimated_glycemic_load: { type: Type.STRING },
        components: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              impact: { type: Type.STRING },
            },
          },
        },
      },
    },
    personalization: {
      type: Type.OBJECT,
      properties: {
        user_factors: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        how_user_factors_change_prediction: { type: Type.STRING },
      },
    },
    coaching_tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    disclaimer: { type: Type.STRING },
    debug_info: {
      type: Type.OBJECT,
      properties: {
        assumptions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        missing_information: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    },
  },
};

export const analyzeMeal = async (
  profile: UserProfile,
  meal: MealInput
): Promise<PredictionResult> => {
  try {
    const parts: any[] = [];

    // Add Image if exists
    if (meal.imageFile) {
      const imageBase64 = await fileToGenerativePart(meal.imageFile);
      parts.push({
        inlineData: {
          mimeType: meal.imageFile.type,
          data: imageBase64,
        },
      });
    }

    // Construct the structured prompt
    const promptData = {
      user_profile: {
        gender: profile.gender,
        age: profile.age,
        activity_level: profile.activity_level,
        bmi_category: profile.bmi_category,
        diagnosis: profile.diagnosis,
        medications: profile.medications,
        fasting_glucose: profile.fasting_glucose,
      },
      meal: {
        photo_description: meal.imageFile ? "이미지 참고" : "이미지 없음",
        user_description: meal.user_description,
        eaten_time: meal.eaten_time,
        portion_level: meal.portion_level,
        previous_glucose: meal.previous_glucose,
      },
    };

    parts.push({
      text: JSON.stringify(promptData),
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    return JSON.parse(response.text) as PredictionResult;
  } catch (error) {
    console.error("Error analyzing meal:", error);
    throw error;
  }
};
