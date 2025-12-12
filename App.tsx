import React, { useState } from 'react';
import { UserProfile, MealInput as MealInputType, PredictionResult, Step } from './types';
import { DEFAULT_USER_PROFILE } from './constants';
import ProfileForm from './components/ProfileForm';
import MealInput from './components/MealInput';
import ResultView from './components/ResultView';
import { analyzeMeal } from './services/geminiService';
import { Loader2, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [mealInput, setMealInput] = useState<MealInputType>({
    photo_description: '',
    user_description: '',
    eaten_time: 'lunch',
    portion_level: 'medium',
    previous_glucose: null,
    imageFile: null
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProfileNext = () => {
    setStep('meal');
  };

  const handleMealSubmit = async () => {
    setStep('analyzing');
    setError(null);
    try {
      const data = await analyzeMeal(userProfile, mealInput);
      setResult(data);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError("혈당을 분석하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setStep('meal');
    }
  };

  const handleReset = () => {
    setStep('profile');
    setMealInput({
      photo_description: '',
      user_description: '',
      eaten_time: 'lunch',
      portion_level: 'medium',
      previous_glucose: null,
      imageFile: null
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative overflow-x-hidden">
        
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
           <div className="flex items-center gap-2 text-teal-600">
             <div className="bg-teal-600 text-white p-1.5 rounded-lg">
               <Activity size={20} />
             </div>
             <span className="font-bold text-lg tracking-tight text-gray-800">간편 혈당 계산기</span>
           </div>
           <div className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-500">
             Beta
           </div>
        </header>

        <main className="p-6">
          {step === 'profile' && (
            <ProfileForm 
              data={userProfile} 
              onChange={setUserProfile} 
              onNext={handleProfileNext} 
            />
          )}

          {step === 'meal' && (
            <MealInput 
              data={mealInput} 
              onChange={setMealInput} 
              onSubmit={handleMealSubmit} 
              onBack={() => setStep('profile')}
            />
          )}

          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
               <div className="relative">
                 <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Activity className="w-6 h-6 text-teal-600 animate-pulse" />
                 </div>
               </div>
               <div>
                 <h2 className="text-xl font-bold text-gray-800 mb-2">AI가 분석 중입니다</h2>
                 <p className="text-gray-500 text-sm">
                   음식 구성을 파악하고<br/>혈당 변화를 예측하고 있어요.
                 </p>
               </div>
            </div>
          )}

          {step === 'result' && result && (
            <ResultView 
              result={result} 
              mealInput={mealInput}
              onReset={handleReset} 
            />
          )}

          {error && (
            <div className="fixed bottom-6 left-6 right-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 shadow-lg text-sm flex items-center gap-3 animate-in slide-in-from-bottom-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {error}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;