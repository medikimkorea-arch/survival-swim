import React, { useState } from 'react';
import {
  ChildProfile,
  SessionInfo,
  DisabilityType,
  DisabilityLevel,
  CommunicationLevel,
  InstructionMode,
  DepthZone,
  ConditionStatus,
  AssistiveDeviceType
} from '../types';
import { User, Calendar, Droplets, ChevronDown, ChevronUp, AlertCircle, LifeBuoy, Check, Plus, X } from 'lucide-react';

interface ChildSessionFormProps {
  child: ChildProfile;
  setChild: React.Dispatch<React.SetStateAction<ChildProfile>>;
  session: SessionInfo;
  setSession: React.Dispatch<React.SetStateAction<SessionInfo>>;
  observation: string;
  setObservation: (obs: string) => void;
}

const DEVICE_OPTIONS: AssistiveDeviceType[] = [
  '팔뜨개·암밴드',
  '킥판',
  '부력조끼·구명조끼',
  '튜브·웨이트벨트',
  '기타'
];

const COMMON_ASSISTED_ITEMS = ['F3', 'F4', 'F5', 'G1', 'G2', 'G3', 'G4', 'E3', 'H2'];

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

          {/* Section 2.5: Assistive Devices (보조기구 착용 여부) */}
          <div className="pt-2 border-t border-slate-100 bg-slate-50/70 p-2.5 rounded border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5 text-slate-700" />
                <h3 className="text-[11px] font-bold text-slate-800 tracking-wider">
                  수중 보조기구 착용 여부 (Assistive Devices)
                </h3>
                <span className="text-[10px] text-slate-500">
                  (착용 상태 평정 시 '독립 부력' 오인 방지 및 용암법 계획 반영)
                </span>
              </div>

              {/* Toggle: 착용 / 미착용 */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() =>
                    setSession({
                      ...session,
                      assistive_device_used: false
                    })
                  }
                  className={`h-6 px-2.5 text-xs font-semibold rounded transition-colors ${
                    !session.assistive_device_used
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  미착용 (맨몸)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSession({
                      ...session,
                      assistive_device_used: true,
                      assistive_device_types:
                        session.assistive_device_types && session.assistive_device_types.length > 0
                          ? session.assistive_device_types
                          : ['팔뜨개·암밴드'],
                      assisted_items: session.assisted_items ?? ['F4', 'G2']
                    })
                  }
                  className={`h-6 px-2.5 text-xs font-semibold rounded transition-colors flex items-center gap-1 ${
                    session.assistive_device_used
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LifeBuoy className="w-3 h-3" />
                  착용함
                </button>
              </div>
            </div>

            {session.assistive_device_used && (
              <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                {/* Device Types Multi-select */}
                <div>
                  <div className="text-[11px] font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <span>착용 보조기구 종류 (복수 선택 가능):</span>
                    <span className="text-[10px] text-slate-400">
                      ({session.assistive_device_types?.length || 0}개 선택됨)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {DEVICE_OPTIONS.map((dev) => {
                      const isChecked = session.assistive_device_types?.includes(dev) ?? false;
                      return (
                        <button
                          key={dev}
                          type="button"
                          onClick={() => {
                            const current = session.assistive_device_types || [];
                            const updated = isChecked
                              ? current.filter((t) => t !== dev)
                              : [...current, dev];
                            setSession({
                              ...session,
                              assistive_device_types: updated
                            });
                          }}
                          className={`h-6 px-2 text-xs rounded border transition-all flex items-center gap-1 font-medium ${
                            isChecked
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                          {dev}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assisted Items Selector */}
                <div>
                  <div className="text-[11px] font-medium text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>보조기구 착용 후 수행한 문항 (assisted_items):</span>
                      <span className="text-[10px] text-slate-400">
                        (선택 입력 · 특히 F호흡·G부력 영역 권장)
                      </span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      현재 등록: {session.assisted_items?.length || 0}개
                    </span>
                  </div>

                  {/* Active chips list */}
                  <div className="flex flex-wrap items-center gap-1 mb-1.5 p-1.5 bg-white rounded border border-slate-200 min-h-[32px]">
                    {session.assisted_items && session.assisted_items.length > 0 ? (
                      session.assisted_items.map((code) => (
                        <span
                          key={code}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded text-[11px] font-mono font-bold"
                        >
                          {code}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = session.assisted_items?.filter((c) => c !== code) || [];
                              setSession({ ...session, assisted_items: updated });
                            }}
                            className="text-amber-700 hover:text-amber-950"
                            title={`${code} 제거`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic px-1">
                        등록된 문항이 없습니다. 아래 빠른 추가 버튼을 누르거나 직접 코드를 입력하세요.
                      </span>
                    )}
                  </div>

                  {/* Quick toggle chips */}
                  <div className="flex flex-wrap items-center gap-1 text-[11px]">
                    <span className="text-slate-500 text-[10px]">자주 착용하는 문항 빠른 추가:</span>
                    {COMMON_ASSISTED_ITEMS.map((itemCode) => {
                      const isAdded = session.assisted_items?.includes(itemCode) ?? false;
                      return (
                        <button
                          key={itemCode}
                          type="button"
                          onClick={() => {
                            const current = session.assisted_items || [];
                            const updated = isAdded
                              ? current.filter((c) => c !== itemCode)
                              : [...current, itemCode];
                            setSession({ ...session, assisted_items: updated });
                          }}
                          className={`h-5 px-1.5 text-[10px] font-mono rounded border transition-colors ${
                            isAdded
                              ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isAdded ? `✓ ${itemCode}` : `+ ${itemCode}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
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
