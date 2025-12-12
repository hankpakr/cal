import React, { useRef, useState } from 'react';
import { MealInput as MealInputType } from '../types';
import { Camera, Utensils, Clock, Droplets, Image as ImageIcon, X } from 'lucide-react';

interface Props {
  data: MealInputType;
  onChange: (data: MealInputType) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const MealInput: React.FC<Props> = ({ data, onChange, onSubmit, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (field: keyof MealInputType, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange('imageFile', file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = () => {
    handleChange('imageFile', null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Image Upload Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-teal-600" />
          음식 사진
        </h2>
        
        <div 
          className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
            previewUrl ? 'border-teal-200 bg-teal-50' : 'border-gray-300 hover:border-teal-400 bg-gray-50'
          }`}
        >
          {previewUrl ? (
            <div className="relative w-full h-full flex justify-center">
              <img src={previewUrl} alt="Meal preview" className="max-h-64 rounded-lg object-contain" />
              <button 
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
                <ImageIcon className="w-8 h-8 text-teal-500" />
              </div>
              <p className="text-sm font-medium text-gray-600">사진을 올리거나 촬영하세요</p>
              <p className="text-xs text-gray-400 mt-1">AI가 사진을 분석하여 혈당을 예측합니다</p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-teal-600" />
          식사 상세
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">어떤 음식을 드시나요?</label>
            <textarea
              value={data.user_description}
              onChange={(e) => handleChange('user_description', e.target.value)}
              placeholder="예: 흰쌀밥 반 공기, 된장찌개, 김치, 계란말이 2개"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none h-24 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 식사 시간
              </label>
              <select
                value={data.eaten_time}
                onChange={(e) => handleChange('eaten_time', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="breakfast">아침</option>
                <option value="lunch">점심</option>
                <option value="dinner">저녁</option>
                <option value="snack">간식</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">식사량</label>
              <select
                value={data.portion_level}
                onChange={(e) => handleChange('portion_level', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="small">적음 (소식)</option>
                <option value="medium">보통</option>
                <option value="large">많음 (과식)</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
               <Droplets className="w-3 h-3 text-red-400" /> 식전 혈당 (선택)
             </label>
             <div className="relative">
               <input
                type="number"
                value={data.previous_glucose || ''}
                onChange={(e) => handleChange('previous_glucose', parseInt(e.target.value) || null)}
                placeholder="mg/dL"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
               />
               <span className="absolute right-4 top-2 text-gray-400 text-sm">mg/dL</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-colors"
        >
          이전
        </button>
        <button
          onClick={onSubmit}
          disabled={!data.user_description && !data.imageFile}
          className={`flex-[2] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
            (!data.user_description && !data.imageFile) 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200 active:scale-95'
          }`}
        >
          AI 혈당 예측하기
        </button>
      </div>
    </div>
  );
};

export default MealInput;
