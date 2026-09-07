import React, { useState } from 'react';
import { AnalysisResult, StageBand } from '../types';
import { DOMAINS } from '../constants/checklist';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Target,
  Sparkles,
  TrendingUp,
  Printer,
  Copy,
  Check,
  Award,
  Users,
  BrainCircuit,
  Compass
} from 'lucide-react';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onRefreshAi?: () => void;
  isAnalyzing?: boolean;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  result,
  onRefreshAi,
  isAnalyzing
}) => {
  const [copied, setCopied] = useState(false);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStageBandColor = (band: StageBand) => {
    switch (band) {
      case '도입기':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case '초기 적응기':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '기능 습득기':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '독립·일반화기':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStageBandBarColor = (band: StageBand) => {
    switch (band) {
      case '도입기':
        return 'bg-rose-500';
      case '초기 적응기':
        return 'bg-amber-500';
      case '기능 습득기':
        return 'bg-blue-600';
      case '독립·일반화기':
        return 'bg-emerald-600';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-3 print:space-y-3" id="analysis-report-container">
      {/* Action Header for Report */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white rounded border border-slate-200 p-2.5 shadow-2xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-900">
              생존수영 지도평가 종합 분석 리포트
            </h2>
            {result.ai_generated ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[10px] font-semibold bg-slate-100 text-slate-800 rounded border border-slate-300">
                <Sparkles className="w-3 h-3 text-slate-700" />
                Gemini 2.5/3.8 Flash AI 분석
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[10px] font-medium bg-slate-100 text-slate-700 rounded border border-slate-200">
                규칙 기반 검증 엔진
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-none">
            아동 코드: <strong className="text-slate-800 font-mono">{result.child_id}</strong> · 회기 차수:{' '}
            <strong className="text-slate-800">제{result.session_no}회기</strong> · 생성일시:{' '}
            {result.created_at ? new Date(result.created_at).toLocaleString('ko-KR') : '현재'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {onRefreshAi && (
            <button
              type="button"
              onClick={onRefreshAi}
              disabled={isAnalyzing}
              className="h-7 px-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-2xs"
            >
              <Sparkles className="w-3 h-3" />
              AI 분석 재생성
            </button>
          )}

          <button
            type="button"
            onClick={copyJson}
            className="h-7 px-2.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors flex items-center gap-1.5 shadow-2xs"
            title="부록 A 스키마 형태의 JSON 복사"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                복사 완료!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                JSON 복사
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="h-7 px-2.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3 h-3" />
            리포트 인쇄
          </button>
        </div>
      </div>

      {/* Safety Alert Flag Banner (Critical) */}
      {result.safety_flag ? (
        <div className="bg-amber-50 border border-amber-300 rounded p-2.5 text-amber-900 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  안전 플래그 경보 (Safety Flag Active)
                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-200 text-amber-900 rounded">
                    최우선 중재 요구
                  </span>
                </h3>
              </div>
              <p className="text-[11px] font-medium text-amber-800 mt-0.5">
                <strong>감지 사유:</strong> {result.safety_reason}
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                ※ 안전 플래그가 활성화된 경우, 지도 권고 수치가 '그룹 편입 시도 가능'이더라도 안전 목표(비상 지지물 잡기, 도움 요청, 깊은 수심 안정)를 완수할 때까지 <strong>1:1 밀착 지도를 우선 유지</strong>해야 합니다.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-emerald-900 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="text-[11px]">
            <span className="font-bold">기본 안전 요건 충족 (Safety Clear):</span> 비상 지지물 잡기, 도움 요청, 수심 적응 등 핵심 안전 항목에서 심각한 위험 지표가 감지되지 않았습니다.
          </div>
        </div>
      )}

      {/* 4 Key Core Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Metric 1: OII */}
        <div className="bg-white rounded border border-slate-200 p-2.5 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-slate-700" />
              전체 독립지수 (OII)
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${getStageBandColor(result.overall_stage_band)}`}>
              {result.overall_stage_band}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
              {result.overall_independence_index}%
            </span>
            <span className="text-[11px] text-slate-400 font-medium font-mono">/ 100%</span>
          </div>
          <div className="w-full bg-slate-100 rounded h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full rounded ${getStageBandBarColor(result.overall_stage_band)}`}
              style={{ width: `${Math.min(100, Math.max(0, result.overall_independence_index))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>도입(0-25)</span>
            <span>초기(26-50)</span>
            <span>기능(51-75)</span>
            <span>독립(76-100)</span>
          </div>
        </div>

        {/* Metric 2: GRI */}
        <div className="bg-white rounded border border-slate-200 p-2.5 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-700" />
              그룹 준비도 지수 (GRI)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">B·C·D·I 평균</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
              {result.group_readiness_index}%
            </span>
            <span className="text-[11px] text-slate-400 font-medium font-mono">/ 100%</span>
          </div>
          <div className="w-full bg-slate-100 rounded h-1.5 mt-2 overflow-hidden">
            <div
              className="h-full rounded bg-slate-800"
              style={{ width: `${Math.min(100, Math.max(0, result.group_readiness_index))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>1:1유지(&lt;40)</span>
            <span>병행(40-64)</span>
            <span>그룹(≥65)</span>
          </div>
        </div>

        {/* Metric 3: Instruction Recommendation */}
        <div className="bg-white rounded border border-slate-200 p-2.5 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-700" />
              권고 지도 형태
            </span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
              GRI 기준
            </span>
          </div>
          <div className="mt-0.5">
            <span className="text-sm font-bold text-slate-900 block leading-snug">
              {result.instruction_recommendation}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
            {result.instruction_recommendation === '1:1 지도 유지 권장'
              ? '그룹 상호작용 및 자기조절 지수가 40% 미만으로 1:1 전담 안전 지도 권장'
              : result.instruction_recommendation === '1:1 유지 + 부분 그룹 병행'
              ? '기본 1:1 수업을 유지하되 5~10분 평행 참여 소그룹 점진적 병행 권고'
              : '안전 수칙 준수 하에 소그룹 생존수영 프로그램 참여 시도 가능'}
          </p>
        </div>

        {/* Metric 4: Evaluated Domains count */}
        <div className="bg-white rounded border border-slate-200 p-2.5 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-slate-700" />
              평가 영역 완성도
            </span>
            <span className="text-[10px] text-slate-800 font-bold bg-slate-100 px-1 py-0.2 rounded">
              9개 전 영역
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
              {result.domain_scores.length}
            </span>
            <span className="text-[11px] text-slate-400 font-medium font-mono">/ 9개 영역</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-snug">
            총 채점 문항 수:{' '}
            <strong className="text-slate-800 font-mono">
              {result.domain_scores.reduce((acc, d) => acc + d.scored_items, 0)}문항
            </strong>{' '}
            (미실시 제외)
          </p>
        </div>
      </div>

      {/* Domain Scores Breakdown Table & Bars */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center justify-between">
          <span>9개 영역별 성취율 및 발달 밴드 현황</span>
          <span className="text-[11px] font-normal text-slate-500">
            A~I 영역별 원점수 및 1~5점 척도 환산 성취율 ((원점수−문항수)/(4×문항수)×100)
          </span>
        </h3>

        <div className="space-y-1.5">
          {result.domain_scores.map((ds) => {
            const meta = DOMAINS[ds.domain];
            return (
              <div key={ds.domain} className="p-2 bg-slate-50 rounded border border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-slate-800 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                      {ds.domain}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {meta?.name || ds.domain}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden md:inline font-mono">
                      [{meta?.framework}]
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="text-slate-500 font-mono text-[10px]">
                      채점: {ds.scored_items}문항 | 원점수: {ds.raw_score}/{ds.max_score}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getStageBandColor(ds.stage_band)}`}>
                      {ds.stage_band}
                    </span>
                    <span className="font-extrabold text-slate-900 font-mono min-w-[45px] text-right text-xs">
                      {ds.achievement_pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded transition-all duration-500 ${getStageBandBarColor(ds.stage_band)}`}
                    style={{ width: `${Math.min(100, Math.max(0, ds.achievement_pct))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Narrative Summary */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-800">
            사례 기록 종합 요약 (Narrative Summary)
          </h3>
          <span className="text-[10px] text-slate-400 font-normal">
            장애인복지관·특수체육 사례기록 양식
          </span>
        </div>
        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
          {result.narrative_summary}
        </div>
      </div>

      {/* Strengths & Priority Needs 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {/* Strengths Card */}
        <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-800">
              강점 요인 (Strengths)
            </h3>
            <span className="text-[10px] text-slate-700 font-medium bg-slate-100 px-1 py-0.2 rounded">
              상위 성취 및 자립 기술
            </span>
          </div>
          <ul className="space-y-1.5">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Needs Card */}
        <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-800">
              우선 지원 요구 (Priority Needs)
            </h3>
            <span className="text-[10px] text-amber-800 font-medium bg-amber-50 px-1 py-0.2 rounded">
              안전우선 및 보완 영역
            </span>
          </div>
          <ul className="space-y-1.5">
            {result.priority_needs.map((pn, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-amber-50/40 p-2 rounded border border-amber-200/80">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{pn}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next Session Goals & Strategies */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-800">
            차기 회기 개별화 목표 및 중재 전략 (Next Session Goals & Strategies)
          </h3>
          <span className="text-[10px] text-slate-500 font-normal">
            Halliwick·PECS·백워드 체이닝 근거 기반 특수체육 전략
          </span>
        </div>

        <div className="space-y-2">
          {result.next_session_goals.map((item, idx) => (
            <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-white font-mono text-[10px] font-bold">
                  영역 {item.domain}
                </span>
                <h4 className="text-xs font-bold text-slate-800">
                  {item.goal}
                </h4>
              </div>
              <div className="mt-1 pl-2 border-l-2 border-slate-400 text-xs text-slate-600 bg-white p-1.5 rounded-r">
                <strong className="text-slate-900 font-semibold">특수체육 중재전략:</strong>{' '}
                {item.strategy}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Note */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5">
          <TrendingUp className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-800">
            회기 진전도 기록 (Progress Note)
          </h3>
        </div>
        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed font-sans">
          {result.progress_note}
        </p>
      </div>
    </div>
  );
};
