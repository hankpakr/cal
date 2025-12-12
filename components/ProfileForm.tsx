import React from 'react';
import { UserProfile } from '../types';
import { User, Activity, HeartPulse, Pill } from 'lucide-react';

interface Props {
  data: UserProfile;
  onChange: (data: UserProfile) => void;
  onNext: () => void;
}

const ProfileForm: React.FC<Props> = ({ data, onChange, onNext }) => {
  const handleChange = (field: keyof UserProfile, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-teal-600" />
          기본 정보
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">나이</label>
            <input
              type="number"
              value={data.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">성별</label>
            <select
              value={data.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white"
            >
              <option value="female">여성</option>
              <option value="male">남성</option>
              <option value="other">기타</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          건강 상태
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">활동 수준</label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => handleChange('activity_level', level)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    data.activity_level === level
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {level === 'low' ? '낮음' : level === 'medium' ? '보통' : '높음'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {data.activity_level === 'low' && '거의 앉아서 생활함'}
              {data.activity_level === 'medium' && '규칙적인 운동 또는 활발한 움직임'}
              {data.activity_level === 'high' && '육체노동 또는 고강도 운동'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">진단 상태 (선택)</label>
            <select
              value={data.diagnosis}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
            >
              <option value="unknown">모름 / 해당없음</option>
              <option value="none">정상</option>
              <option value="prediabetes">당뇨 전단계 (공복혈당장애)</option>
              <option value="diabetes">당뇨병</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-teal-600" />
          추가 정보
        </h2>
        
        <div>
           <label className="block text-sm font-medium text-gray-600 mb-1">복용중인 약물 (선택)</label>
           <input
              type="text"
              placeholder="예: 메트포르민 500mg, 인슐린 등"
              value={data.medications}
              onChange={(e) => handleChange('medications', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-200 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        다음: 식사 정보 입력 <HeartPulse className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ProfileForm;
