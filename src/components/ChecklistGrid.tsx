import React, { useState } from 'react';
import { ScoreValue, ItemType } from '../types';
import { CHECKLIST_ITEMS, DOMAINS, RUBRIC_INFO } from '../constants/checklist';
import {
  ShieldAlert,
  Info,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';

interface ChecklistGridProps {
  scores: Record<string, ScoreValue>;
  setScores: React.Dispatch<React.SetStateAction<Record<string, ScoreValue>>>;
  naItems: string[];
  setNaItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ChecklistGrid: React.FC<ChecklistGridProps> = ({
  scores,
  setScores,
  naItems,
  setNaItems
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [rubricModalType, setRubricModalType] = useState<ItemType | null>(null);

  const domainKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const handleScoreChange = (code: string, val: ScoreValue) => {
    setScores((prev) => ({
      ...prev,
      [code]: val
    }));

    if (val === null) {
      if (!naItems.includes(code)) {
        setNaItems((prev) => [...prev, code]);
      }
    } else {
      if (naItems.includes(code)) {
        setNaItems((prev) => prev.filter((c) => c !== code));
      }
    }
  };

  const handleSetDomainScores = (domainCode: string, score: ScoreValue) => {
    const domainItems = CHECKLIST_ITEMS.filter((i) => i.domain === domainCode);
    const updated = { ...scores };
    const newNa = [...naItems];

    domainItems.forEach((i) => {
      updated[i.code] = score;
      if (score === null) {
        if (!newNa.includes(i.code)) newNa.push(i.code);
      } else {
        const idx = newNa.indexOf(i.code);
        if (idx !== -1) newNa.splice(idx, 1);
      }
    });

    setScores(updated);
    setNaItems(newNa);
  };

  const filteredItems =
    selectedDomain === 'ALL'
      ? CHECKLIST_ITEMS
      : CHECKLIST_ITEMS.filter((item) => item.domain === selectedDomain);

  // Calculate quick stats
  const totalItems = CHECKLIST_ITEMS.length;
  const scoredCount = CHECKLIST_ITEMS.filter(
    (i) => scores[i.code] !== null && scores[i.code] !== undefined
  ).length;
  const naCount = CHECKLIST_ITEMS.filter((i) => scores[i.code] === null).length;

  return (
    <div className="space-y-3">
      {/* Top Filter and Stats Bar */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-white shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800">
                44문항 영역별 평가 체크리스트
              </h2>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">
                0~4점 평정 또는 미실시(N/A) · 총 44문항 중 {scoredCount}개 채점 완료 (N/A {naCount}개)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRubricModalType('support')}
              className="h-6 px-2 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors flex items-center gap-1 shadow-2xs"
            >
              <HelpCircle className="w-3 h-3 text-slate-700" />
              기술수행(support) 루브릭
            </button>
            <button
              type="button"
              onClick={() => setRubricModalType('tolerance')}
              className="h-6 px-2 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors flex items-center gap-1 shadow-2xs"
            >
              <HelpCircle className="w-3 h-3 text-slate-700" />
              정서·감각(tolerance) 루브릭
            </button>
          </div>
        </div>

        {/* Domain Selection Tabs with Live Completion */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedDomain('ALL')}
            className={`px-2 py-1 text-xs rounded font-medium text-center transition-all border ${
              selectedDomain === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            전체 44문항
            <div className="text-[10px] opacity-75 font-mono">
              {scoredCount}/{totalItems}
            </div>
          </button>

          {domainKeys.map((d) => {
            const meta = DOMAINS[d];
            const dItems = CHECKLIST_ITEMS.filter((i) => i.domain === d);
            const dScored = dItems.filter(
              (i) => scores[i.code] !== null && scores[i.code] !== undefined
            ).length;
            const isAllScored = dScored === dItems.length;

            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDomain(d)}
                className={`px-2 py-1 text-xs rounded font-medium text-left transition-all border ${
                  selectedDomain === d
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{d}</span>
                  <span className={`text-[10px] font-mono px-1 rounded-xs ${
                    selectedDomain === d
                      ? 'bg-slate-800 text-white'
                      : isAllScored
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {dScored}/{dItems.length}
                  </span>
                </div>
                <div className="text-[10px] truncate opacity-85 leading-tight" title={meta.name}>
                  {meta.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Domain Quick Actions Bar if single domain selected */}
      {selectedDomain !== 'ALL' && (
        <div className="bg-slate-100 border border-slate-200 rounded p-2 flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center font-mono">
              {selectedDomain}
            </span>
            <span className="text-xs font-bold text-slate-900">
              {DOMAINS[selectedDomain].name}
            </span>
            <span className="text-[11px] text-slate-600 hidden sm:inline">
              — {DOMAINS[selectedDomain].description} ({DOMAINS[selectedDomain].framework})
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 mr-1 text-[11px]">일괄 평정:</span>
            {[4, 2, 1].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleSetDomainScores(selectedDomain, val as ScoreValue)}
                className="h-6 px-2 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 text-xs font-mono shadow-2xs"
              >
                {val}점
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleSetDomainScores(selectedDomain, null)}
              className="h-6 px-2 bg-white border border-slate-200 rounded text-slate-500 hover:bg-slate-50 text-xs font-mono shadow-2xs"
            >
              N/A
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filteredItems.map((item) => {
          const currentScore = scores[item.code];
          const isNa = currentScore === null;
          const isSafetyCritical = ['H2', 'H3', 'D4'].includes(item.code);

          return (
            <div
              key={item.code}
              id={`item-card-${item.code}`}
              className={`bg-white rounded border p-2.5 transition-all shadow-2xs ${
                isSafetyCritical
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Item Header */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-start gap-2">
                  <span className="w-7 h-6 shrink-0 rounded bg-slate-100 border border-slate-200 font-mono text-[11px] font-bold text-slate-800 flex items-center justify-center">
                    {item.code}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-semibold px-1 py-0.2 rounded border ${
                          item.type === 'support'
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.type === 'support' ? '기술(support)' : '감각(tolerance)'}
                      </span>
                      {isSafetyCritical && (
                        <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-0.5">
                          <ShieldAlert className="w-2.5 h-2.5 text-amber-600" />
                          안전핵심
                        </span>
                      )}
                      {item.frameworkNote && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          [{item.frameworkNote}]
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 mt-0.5 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Score Button Group */}
              <div className="pt-1.5 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="text-[10px]">평정 (0~4)</span>
                  <span className="font-medium text-slate-700 text-[11px] truncate max-w-[200px]">
                    {currentScore === null
                      ? '미실시 (N/A)'
                      : currentScore === 0
                      ? item.type === 'support' ? '0점: 수행불가/거부' : '0점: 극심한 부정반응'
                      : currentScore === 1
                      ? item.type === 'support' ? '1점: 최대지원' : '1점: 강한 부정반응'
                      : currentScore === 2
                      ? item.type === 'support' ? '2점: 중간지원' : '2점: 중간 내성'
                      : currentScore === 3
                      ? item.type === 'support' ? '3점: 최소지원' : '3점: 경미 반응'
                      : item.type === 'support' ? '4점: 독립수행' : '4점: 안정적 수용'}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-1">
                  {[0, 1, 2, 3, 4].map((val) => {
                    const isSelected = currentScore === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleScoreChange(item.code, val as ScoreValue)}
                        className={`h-6 rounded text-xs font-mono font-bold transition-all border ${
                          isSelected
                            ? val === 4
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs ring-1 ring-slate-700'
                              : val === 3
                              ? 'bg-slate-800 text-white border-slate-800 shadow-2xs ring-1 ring-slate-600'
                              : val === 2
                              ? 'bg-amber-600 text-white border-amber-600 shadow-2xs ring-1 ring-amber-500'
                              : val === 1
                              ? 'bg-orange-600 text-white border-orange-600 shadow-2xs ring-1 ring-orange-500'
                              : 'bg-rose-600 text-white border-rose-600 shadow-2xs ring-1 ring-rose-500'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                        title={
                          item.type === 'support'
                            ? RUBRIC_INFO.support.levels[val].label
                            : RUBRIC_INFO.tolerance.levels[val].label
                        }
                      >
                        {val}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handleScoreChange(item.code, null)}
                    className={`h-6 rounded text-xs font-mono font-medium transition-all border ${
                      isNa
                        ? 'bg-slate-700 text-white border-slate-700 shadow-2xs ring-1 ring-slate-500'
                        : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                    title="미실시 문항(계산에서 제외)"
                  >
                    N/A
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rubric Modal */}
      {rubricModalType && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded max-w-lg w-full p-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-slate-700" />
                {RUBRIC_INFO[rubricModalType].title}
              </h3>
              <button
                type="button"
                onClick={() => setRubricModalType(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1.5 py-0.5"
              >
                닫기 ✕
              </button>
            </div>

            <div className="space-y-2">
              {RUBRIC_INFO[rubricModalType].levels.map((lvl) => (
                <div key={lvl.score} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-900">{lvl.label}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-800">
                      {lvl.score}점
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{lvl.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setRubricModalType(null)}
                className="h-7 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
