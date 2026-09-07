import React from 'react';
import { SessionRecord, AnalysisResult } from '../types';
import { calculateSingleSession } from '../utils/calculationEngine';
import { DOMAINS } from '../constants/checklist';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, AlertCircle, Calendar, Plus } from 'lucide-react';

interface MultiSessionTrackerProps {
  sessions: SessionRecord[];
  onSelectSession: (record: SessionRecord) => void;
  activeRecordId: string;
  onAddNewSession: () => void;
}

export const MultiSessionTracker: React.FC<MultiSessionTrackerProps> = ({
  sessions,
  onSelectSession,
  activeRecordId,
  onAddNewSession
}) => {
  // Sort sessions by session_no ascending
  const sorted = [...sessions].sort((a, b) => a.session.session_no - b.session.session_no);

  const analyses = sorted.map((s, idx) => {
    const prev = idx > 0 ? sorted[idx - 1] : undefined;
    return {
      record: s,
      analysis: calculateSingleSession(s, prev, sorted)
    };
  });

  const domainKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  return (
    <div className="space-y-3">
      {/* Overview Card */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
          <div>
            <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-slate-800" />
              다회기 누적 진전도 및 종단 변화 분석 (Longitudinal Tracking)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-none">
              회기별 독립지수(OII) 및 영역별 Δ 변화량 추적 · 유의미한 진전(문항 +1점 또는 영역 +10%p) 감지
            </p>
          </div>

          <button
            type="button"
            onClick={onAddNewSession}
            className="h-7 px-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            새 회기 추가 기록
          </button>
        </div>

        {/* Session Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {analyses.map(({ record, analysis }) => {
            const isSelected = record.record_id === activeRecordId;
            return (
              <button
                key={record.record_id}
                type="button"
                onClick={() => onSelectSession(record)}
                className={`px-2.5 py-1 rounded text-left border transition-all shrink-0 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold">
                    제{record.session.session_no}회기
                  </span>
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                    isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {record.session.date}
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className={`text-xs font-extrabold font-mono ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    OII {analysis.overall_independence_index}%
                  </span>
                  <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    ({analysis.overall_stage_band})
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs overflow-x-auto">
        <h3 className="text-xs font-bold text-slate-800 tracking-wider mb-2">
          회기별 영역 성취율(%) 및 Δ 변화 추이
        </h3>

        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="py-1.5 px-2.5 font-semibold text-slate-700">영역 코드 / 영역명</th>
              {analyses.map(({ record }) => (
                <th key={record.record_id} className="py-1.5 px-2.5 font-semibold text-slate-700 text-center">
                  제{record.session.session_no}회기 ({record.session.date})
                </th>
              ))}
              {analyses.length >= 2 && (
                <th className="py-1.5 px-2.5 font-semibold text-slate-800 text-center bg-slate-100">
                  최근 회기 대비 Δ 변화량
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {domainKeys.map((d) => {
              const meta = DOMAINS[d];
              const latestIdx = analyses.length - 1;
              const prevIdx = analyses.length - 2;

              const latestPct =
                analyses[latestIdx]?.analysis.domain_scores.find((ds) => ds.domain === d)
                  ?.achievement_pct ?? 0;
              const prevPct =
                prevIdx >= 0
                  ? analyses[prevIdx]?.analysis.domain_scores.find((ds) => ds.domain === d)
                      ?.achievement_pct ?? 0
                  : null;

              const delta =
                prevPct !== null ? Math.round((latestPct - prevPct) * 10) / 10 : null;

              return (
                <tr key={d} className="hover:bg-slate-50/60">
                  <td className="py-1.5 px-2.5 font-medium text-slate-800">
                    <span className="font-mono font-bold text-slate-900 mr-1.5">{d}</span>
                    {meta.name}
                  </td>
                  {analyses.map(({ record, analysis }) => {
                    const ds = analysis.domain_scores.find((s) => s.domain === d);
                    const pct = ds ? ds.achievement_pct : 0;
                    return (
                      <td key={record.record_id} className="py-1.5 px-2.5 text-center font-mono">
                        {pct}%
                      </td>
                    );
                  })}
                  {analyses.length >= 2 && delta !== null && (
                    <td className="py-1.5 px-2.5 text-center font-mono font-bold bg-slate-50">
                      {delta > 0 ? (
                        <span className="inline-flex items-center text-emerald-600">
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{delta}%p
                          {delta >= 10 && (
                            <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-sans">
                              유의미
                            </span>
                          )}
                        </span>
                      ) : delta < 0 ? (
                        <span className="inline-flex items-center text-rose-600">
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                          {delta}%p
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-400">
                          <Minus className="w-3.5 h-3.5 mr-0.5" />
                          0.0%p
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}

            {/* Total Summary Row: OII */}
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
              <td className="py-1.5 px-2.5 text-slate-900">전체 독립지수 (OII)</td>
              {analyses.map(({ record, analysis }) => (
                <td key={record.record_id} className="py-1.5 px-2.5 text-center font-mono text-slate-900">
                  {analysis.overall_independence_index}%
                </td>
              ))}
              {analyses.length >= 2 && (
                <td className="py-1.5 px-2.5 text-center font-mono font-extrabold text-slate-900 bg-slate-100">
                  {(() => {
                    const latest = analyses[analyses.length - 1].analysis.overall_independence_index;
                    const prev = analyses[analyses.length - 2].analysis.overall_independence_index;
                    const diff = Math.round((latest - prev) * 10) / 10;
                    return diff > 0 ? `+${diff}%p` : `${diff}%p`;
                  })()}
                </td>
              )}
            </tr>

            {/* GRI Row */}
            <tr className="bg-slate-50 font-bold">
              <td className="py-1.5 px-2.5 text-slate-900">그룹 준비도 지수 (GRI)</td>
              {analyses.map(({ record, analysis }) => (
                <td key={record.record_id} className="py-1.5 px-2.5 text-center font-mono text-slate-900">
                  {analysis.group_readiness_index}%
                </td>
              ))}
              {analyses.length >= 2 && (
                <td className="py-1.5 px-2.5 text-center font-mono font-extrabold text-slate-900 bg-slate-100">
                  {(() => {
                    const latest = analyses[analyses.length - 1].analysis.group_readiness_index;
                    const prev = analyses[analyses.length - 2].analysis.group_readiness_index;
                    const diff = Math.round((latest - prev) * 10) / 10;
                    return diff > 0 ? `+${diff}%p` : `${diff}%p`;
                  })()}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Progress Note from Latest Session */}
      {analyses.length > 0 && (
        <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 tracking-wider mb-1.5">
            최근 회기 진전도 서술 (Progress Note)
          </h3>
          <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
            {analyses[analyses.length - 1].analysis.progress_note}
          </p>
        </div>
      )}
    </div>
  );
};
