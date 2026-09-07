import React from 'react';
import {
  LifeBuoy,
  FileCheck2,
  Sparkles,
  RefreshCw,
  Code2,
  TrendingUp,
  SlidersHorizontal,
  Bot
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'checklist' | 'analysis' | 'multi_session' | 'json_mode' | 'prompt_hub';
  setActiveTab: (tab: 'checklist' | 'analysis' | 'multi_session' | 'json_mode' | 'prompt_hub') => void;
  onLoadSample: () => void;
  onLoadMultiSample: () => void;
  onReset: () => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onLoadSample,
  onLoadMultiSample,
  onReset,
  onRunAnalysis,
  isAnalyzing,
  hasResult
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white shadow-2xs shrink-0">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                  발달장애 아동 생존수영 체크리스트 분석기
                </h1>
                <span className="px-1.5 py-0.2 text-[10px] font-mono font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Halliwick & HAAR v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">
                44문항 평가 · OII/GRI 지표 산출 · 안전 플래그 감지 · AI 특수체육 중재계획
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={onLoadSample}
              id="load-sample-btn"
              className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 transition-colors shadow-2xs"
              title="부록 B에 수록된 샘플 입력 데이터(C001-S07)를 불러옵니다"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-slate-700" />
              샘플(부록 B) 불러오기
            </button>

            <button
              type="button"
              onClick={onLoadMultiSample}
              id="load-multi-sample-btn"
              className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 transition-colors shadow-2xs"
              title="6회기 및 7회기 다회기 데이터 불러오기"
            >
              <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
              다회기(S06+S07)
            </button>

            <button
              type="button"
              onClick={onReset}
              id="reset-form-btn"
              className="inline-flex items-center gap-1 h-7 px-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 rounded border border-slate-200 transition-colors shadow-2xs"
              title="모든 항목 초기화"
            >
              <RefreshCw className="w-3 h-3" />
              초기화
            </button>

            <button
              type="button"
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              id="run-ai-analysis-btn"
              className="inline-flex items-center gap-1.5 h-7 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded shadow-2xs transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  분석 및 지도계획 생성
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 mt-2 pt-1.5 border-t border-slate-200 overflow-x-auto text-xs">
          <button
            type="button"
            id="tab-checklist"
            onClick={() => setActiveTab('checklist')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-slate-900 text-white font-medium shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-normal'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            44문항 체크리스트 평가
          </button>

          <button
            type="button"
            id="tab-analysis"
            onClick={() => setActiveTab('analysis')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'analysis'
                ? 'bg-slate-900 text-white font-medium shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-normal'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            분석 종합 리포트
            {hasResult && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            )}
          </button>

          <button
            type="button"
            id="tab-multi-session"
            onClick={() => setActiveTab('multi_session')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'multi_session'
                ? 'bg-slate-900 text-white font-medium shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-normal'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            다회기 진전도 추적 (Δ 변화)
          </button>

          <button
            type="button"
            id="tab-json-mode"
            onClick={() => setActiveTab('json_mode')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'json_mode'
                ? 'bg-slate-900 text-white font-medium shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-normal'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            JSON 입출력
          </button>

          <button
            type="button"
            id="tab-prompt-hub"
            onClick={() => setActiveTab('prompt_hub')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'prompt_hub'
                ? 'bg-slate-900 text-white font-medium shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-normal'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Google AI Studio 프롬프트
          </button>
        </nav>
      </div>
    </header>
  );
};
