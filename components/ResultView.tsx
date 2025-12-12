import React from 'react';
import { PredictionResult, MealInput } from '../types';
import { ArrowUp, AlertCircle, CheckCircle, Info, RefreshCcw, Smartphone, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface Props {
  result: PredictionResult;
  mealInput: MealInput;
  onReset: () => void;
}

const ResultView: React.FC<Props> = ({ result, mealInput, onReset }) => {
  const prevGlucose = mealInput.previous_glucose || 100; // Default baseline if not provided
  const minGlucose = prevGlucose + result.prediction.expected_delta_mgdl_min;
  const maxGlucose = prevGlucose + result.prediction.expected_delta_mgdl_max;
  
  // Data for chart
  const chartData = [
    {
      name: '식전',
      glucose: prevGlucose,
      type: 'base'
    },
    {
      name: '예상 피크',
      glucose: [minGlucose, maxGlucose], // Range for Bar chart
      type: 'prediction'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-green-600 bg-green-50 border-green-100';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch(level) {
      case 'high': return '#dc2626';
      case 'moderate': return '#ea580c';
      default: return '#16a34a';
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-10">
      
      {/* Summary Card */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-teal-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-blue-500"></div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">{result.summary.short_title}</h1>
        <p className="text-gray-600 leading-relaxed text-sm mb-4">
          {result.summary.one_line_summary}
        </p>
        
        <div className={`flex items-start gap-3 p-3 rounded-xl border ${getRiskColor(result.prediction.risk_level)}`}>
           <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
           <div>
             <p className="text-sm font-bold uppercase tracking-wide text-xs mb-1">
               위험도: {result.prediction.risk_level === 'high' ? '높음' : result.prediction.risk_level === 'moderate' ? '보통' : '낮음'}
             </p>
             <p className="text-sm font-medium">
               {result.prediction.main_risk_factor}
             </p>
           </div>
        </div>
      </div>

      {/* Prediction Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ArrowUp className="w-5 h-5 text-teal-600" />
          예상 혈당 변화
        </h2>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    if(data.type === 'base') return (
                      <div className="bg-white p-2 shadow-lg rounded border border-gray-100 text-xs">
                        식전: {data.glucose} mg/dL
                      </div>
                    );
                    return (
                       <div className="bg-white p-2 shadow-lg rounded border border-gray-100 text-xs">
                        예상범위: {data.glucose[0]} ~ {data.glucose[1]} mg/dL
                      </div>
                    )
                  }
                  return null;
                }}
              />
              <ReferenceLine y={180} stroke="red" strokeDasharray="3 3" label={{ value: '180 (주의)', position: 'insideTopRight', fill: 'red', fontSize: 10 }} />
              <Bar dataKey="glucose" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.type === 'base' ? '#cbd5e1' : getRiskBadgeColor(result.prediction.risk_level)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm px-2">
           <div className="text-gray-500">
             식전 <span className="text-gray-900 font-bold text-lg">{prevGlucose}</span>
           </div>
           <div className="text-teal-600">
             ▲ <span className="font-bold text-xl">+{result.prediction.expected_delta_mgdl_min}~{result.prediction.expected_delta_mgdl_max}</span> mg/dL
           </div>
        </div>
      </div>

      {/* Meal Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">음식 분석</h2>
        <div className="space-y-3">
           <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
             <span className="text-sm text-gray-600">추정 탄수화물</span>
             <span className="font-bold text-gray-800">{result.meal_analysis.estimated_carbs_grams}g</span>
           </div>
           
           <div className="mt-4">
             {result.meal_analysis.components.map((comp, idx) => (
               <div key={idx} className="mb-3 last:mb-0 border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                 <div className="flex justify-between mb-1">
                   <span className="font-medium text-gray-900">{comp.name}</span>
                   <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-500">{comp.role}</span>
                 </div>
                 <p className="text-xs text-gray-500">{comp.impact}</p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Coaching Tips */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
           <CheckCircle className="w-5 h-5 text-teal-600" />
           맞춤형 코칭
        </h2>
        <ul className="space-y-3">
          {result.coaching_tips.map((tip, idx) => (
            <li key={idx} className="flex gap-3 text-sm leading-relaxed text-gray-700">
              <span className="bg-teal-100 text-teal-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{idx + 1}</span>
              {tip}
            </li>
          ))}
        </ul>
        
        {result.personalization.how_user_factors_change_prediction && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 italic">
             💡 {result.personalization.how_user_factors_change_prediction}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-400 leading-normal flex gap-2">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>{result.disclaimer}</p>
      </div>

      {/* Glucofit Promotion (Call to Action) */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl overflow-hidden text-white relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Smartphone size={120} />
        </div>
        <div className="p-6 relative z-10">
          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3 backdrop-blur-sm border border-white/10">
            더 정확한 관리가 필요하신가요?
          </div>
          <h2 className="text-xl font-bold mb-2">실제 내 혈당은 다를 수 있어요</h2>
          <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
            사람마다 혈당 반응은 제각각입니다. <br/>
            <strong>글루코핏(Glucofit)</strong>에서 연속혈당측정기와 전문가 코칭으로 내 몸에 딱 맞는 정답을 찾아보세요.
          </p>
          
          <button 
            onClick={() => window.open('https://glucofit.co.kr', '_blank')}
            className="w-full bg-white text-indigo-700 font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            글루코핏 앱 다운로드 받기 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-2 pb-6">
        <button 
          onClick={onReset}
          className="w-full bg-transparent border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
        >
          <RefreshCcw className="w-4 h-4" /> 다른 음식 분석하기
        </button>
      </div>

    </div>
  );
};

export default ResultView;