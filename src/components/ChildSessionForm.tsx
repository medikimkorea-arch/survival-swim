import React, { useState } from 'react';
import {
  ChildProfile,
  SessionInfo,
  DisabilityType,
  DisabilityLevel,
  CommunicationLevel,
  InstructionMode,
  DepthZone,
  ConditionStatus
} from '../types';
import { User, Calendar, Droplets, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface ChildSessionFormProps {
  child: ChildProfile;
  setChild: React.Dispatch<React.SetStateAction<ChildProfile>>;
  session: SessionInfo;
  setSession: React.Dispatch<React.SetStateAction<SessionInfo>>;
  observation: string;
  setObservation: (obs: string) => void;
}

export const ChildSessionForm: React.FC<ChildSessionFormProps> = ({
  child,
  setChild,
  session,
  setSession,
  observation,
  setObservation
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded border border-slate-200 shadow-2xs mb-3 overflow-hidden">
      {/* Header Bar */}
      <div
        className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        id="toggle-profile-form"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
            {child.child_id || 'ID'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-800">
                아동 프로필 및 회기 환경 정보
              </h2>
              <span className="text-[11px] text-slate-500 font-normal">
                ({child.sex} / 만 {child.age_years}세 / {child.disability_type} {child.disability_level} / 제{session.session_no}회기)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none">
              일자: {session.date} · 수온: {session.water_temp_c}°C · 수심: {session.depth_zone} · 지도: {session.instruction_mode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
          <span>{isOpen ? '접기' : '펼치기'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-3 space-y-2.5">
          {/* Section 1: Child Profile */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-slate-700" />
              <h3 className="text-[11px] font-bold text-slate-700 tracking-wider">아동 인적 및 발달 특성</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="child-id">
                  아동 식별코드
                </label>
                <input
                  id="child-id"
                  type="text"
                  value={child.child_id}
                  onChange={(e) => setChild({ ...child, child_id: e.target.value })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden font-mono"
                  placeholder="예: C001"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="child-sex">
                  성별
                </label>
                <select
                  id="child-sex"
                  value={child.sex}
                  onChange={(e) => setChild({ ...child, sex: e.target.value as '남' | '여' })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden"
                >
                  <option value="남">남 (Male)</option>
                  <option value="여">여 (Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="child-birth-ym">
                  생년월 / 나이
                </label>
                <div className="flex items-center gap-1">
                  <input
                    id="child-birth-ym"
                    type="text"
                    value={child.birth_ym}
                    onChange={(e) => setChild({ ...child, birth_ym: e.target.value })}
                    className="w-2/3 h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden font-mono"
                    placeholder="2017-04"
                  />
                  <input
                    id="child-age-years"
                    type="number"
                    step="0.1"
                    value={child.age_years}
                    onChange={(e) => setChild({ ...child, age_years: parseFloat(e.target.value) || 0 })}
                    className="w-1/3 h-7 px-1.5 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden text-center font-mono"
                    placeholder="9.4"
                    title="만 나이 (세)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="child-disability-type">
                  장애 유형
                </label>
                <select
                  id="child-disability-type"
                  value={child.disability_type}
                  onChange={(e) => setChild({ ...child, disability_type: e.target.value as DisabilityType })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden"
                >
                  <option value="자폐성장애">자폐성장애 (ASD)</option>
                  <option value="지적장애">지적장애 (ID)</option>
                  <option value="기타발달장애">기타발달장애</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="child-disability-level">
                  장애 정도
                </label>
                <select
                  id="child-disability-level"
                  value={child.disability_level}
                  onChange={(e) => setChild({ ...child, disability_level: e.target.value as DisabilityLevel })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden"
                >
                  <option value="심함">심함 (중증)</option>
                  <option value="중간">중간</option>
                  <option value="경도">경도 (경증)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="child-comm-level">
                  의사소통 수준
                </label>
                <select
                  id="child-comm-level"
                  value={child.communication_level}
                  onChange={(e) => setChild({ ...child, communication_level: e.target.value as CommunicationLevel })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden"
                >
                  <option value="구어">구어 표현 가능</option>
                  <option value="부분구어">부분구어 (단어/어절)</option>
                  <option value="비구어(AAC)">비구어(AAC/제스처)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Session Info */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-700" />
              <h3 className="text-[11px] font-bold text-slate-700 tracking-wider">회기 환경 및 지도 조건</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="session-date">
                  회기 일자
                </label>
                <input
                  id="session-date"
                  type="date"
                  value={session.date}
                  onChange={(e) => setSession({ ...session, date: e.target.value })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="session-no">
                  회기 차수
                </label>
                <input
                  id="session-no"
                  type="number"
                  min="1"
                  value={session.session_no}
                  onChange={(e) => setSession({ ...session, session_no: parseInt(e.target.value) || 1 })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden text-center font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="session-mode">
                  지도 형태
                </label>
                <select
                  id="session-mode"
                  value={session.instruction_mode}
                  onChange={(e) => setSession({ ...session, instruction_mode: e.target.value as InstructionMode })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden"
                >
                  <option value="1:1">1:1 개별 지도</option>
                  <option value="그룹">소그룹 지도</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="session-instructor">
                  담당 지도사 ID
                </label>
                <input
                  id="session-instructor"
                  type="text"
                  value={session.instructor_id}
                  onChange={(e) => setSession({ ...session, instructor_id: e.target.value })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden font-mono"
                  placeholder="T-KIM"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="session-temp">
                  수온 (°C)
                </label>
                <input
                  id="session-temp"
                  type="number"
                  step="0.1"
                  value={session.water_temp_c}
                  onChange={(e) => setSession({ ...session, water_temp_c: parseFloat(e.target.value) || 30 })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden text-center font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="session-depth">
                  수심 구역
                </label>
                <select
                  id="session-depth"
                  value={session.depth_zone}
                  onChange={(e) => setSession({ ...session, depth_zone: e.target.value as DepthZone })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden"
                >
                  <option value="얕은">얕은 곳 (발 닿음)</option>
                  <option value="중간">중간 수심</option>
                  <option value="깊은">깊은 곳 (발 안 닿음)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5" htmlFor="session-condition">
                  당일 컨디션
                </label>
                <select
                  id="session-condition"
                  value={session.condition}
                  onChange={(e) => setSession({ ...session, condition: e.target.value as ConditionStatus })}
                  className="w-full h-7 px-2 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden"
                >
                  <option value="양호">양호</option>
                  <option value="보통">보통</option>
                  <option value="불안정">불안정</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Observation & Session Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-0.5" htmlFor="session-notes">
                회기 운영 메모 (notes)
              </label>
              <input
                id="session-notes"
                type="text"
                value={session.notes}
                onChange={(e) => setSession({ ...session, notes: e.target.value })}
                className="w-full h-7 px-2.5 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden"
                placeholder="예: 입수 초반 5분 저항, 시각일정표 제시 후 진정."
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-0.5" htmlFor="session-observation">
                행동 관찰 자유 서술 (observation)
              </label>
              <input
                id="session-observation"
                type="text"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full h-7 px-2.5 py-0.5 text-xs bg-white border border-slate-200 rounded focus:border-slate-400 focus:outline-hidden"
                placeholder="예: 얼굴에 물 닿는 자극(D2)에 회피 강함. 새우등뜨기는 신체보조 시 1~2초 유지."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
