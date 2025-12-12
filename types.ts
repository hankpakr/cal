export interface UserProfile {
  gender: 'female' | 'male' | 'other';
  age: number;
  activity_level: 'low' | 'medium' | 'high';
  bmi_category: 'underweight' | 'normal' | 'overweight' | 'obese' | 'unknown';
  diagnosis: 'none' | 'prediabetes' | 'diabetes' | 'unknown';
  medications: string;
  fasting_glucose: number | null;
}

export interface MealInput {
  photo_description: string;
  user_description: string;
  eaten_time: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  portion_level: 'small' | 'medium' | 'large';
  previous_glucose: number | null;
  imageFile: File | null;
}

// Gemini Response Types
export interface Component {
  name: string;
  role: string;
  impact: string;
}

export interface MealAnalysis {
  estimated_carbs_grams: number;
  estimated_glycemic_load: string;
  components: Component[];
}

export interface Prediction {
  expected_delta_mgdl_min: number;
  expected_delta_mgdl_max: number;
  confidence_level: 'low' | 'medium' | 'high';
  reason_for_confidence: string;
  risk_level: 'low' | 'moderate' | 'high';
  main_risk_factor: string;
}

export interface Summary {
  short_title: string;
  one_line_summary: string;
}

export interface Personalization {
  user_factors: string[];
  how_user_factors_change_prediction: string;
}

export interface DebugInfo {
  assumptions: string[];
  missing_information: string[];
}

export interface PredictionResult {
  summary: Summary;
  prediction: Prediction;
  meal_analysis: MealAnalysis;
  personalization: Personalization;
  coaching_tips: string[];
  disclaimer: string;
  debug_info: DebugInfo;
}

export type Step = 'profile' | 'meal' | 'analyzing' | 'result';
