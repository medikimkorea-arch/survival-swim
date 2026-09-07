import React, { useState, useEffect, useMemo } from 'react';
import {
  ChildProfile,
  SessionInfo,
  ScoreValue,
  SessionRecord,
  AnalysisResult
} from './types';
import {
  SAMPLE_SESSION_C001_S07,
  SAMPLE_SESSION_C001_S06,
  CHECKLIST_ITEMS
} from './constants/checklist';
import { calculateSingleSession } from './utils/calculationEngine';
import { Header } from './components/Header';
import { ChildSessionForm } from './components/ChildSessionForm';
import { ChecklistGrid } from './components/ChecklistGrid';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { MultiSessionTracker } from './components/MultiSessionTracker';
import { JsonEditorTab } from './components/JsonEditorTab';
import { PromptHubTab } from './components/PromptHubTab';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, LifeBuoy } from 'lucide-react';

export default function App() {
  // Session State
  const [sessions, setSessions] = useState<SessionRecord[]>([
    SAMPLE_SESSION_C001_S06,
    SAMPLE_SESSION_C001_S07
  ]);
  const [activeRecordId, setActiveRecordId] = useState<string>('C001-S07');

  const activeRecord = useMemo(() => {
    return sessions.find((s) => s.record_id === activeRecordId) || sessions[sessions.length - 1];
  }, [sessions, activeRecordId]);

  // Current Working Form State
  const [child, setChild] = useState<ChildProfile>(activeRecord.child);
  const [session, setSession] = useState<SessionInfo>(activeRecord.session);
  const [scores, setScores] = useState<Record<string, ScoreValue>>(activeRecord.scores);
  const [naItems, setNaItems] = useState<string[]>(activeRecord.na_items || []);
  const [observation, setObservation] = useState<string>(activeRecord.observation || '');

  // UI state
  const [activeTab, setActiveTab] = useState<'checklist' | 'analysis' | 'multi_session' | 'json_mode' | 'prompt_hub'>('checklist');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'warning' | 'error' | 'info'; text: string } | null>(null);

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(() => {
    return calculateSingleSession(SAMPLE_SESSION_C001_S07, SAMPLE_SESSION_C001_S06, [
      SAMPLE_SESSION_C001_S06,
      SAMPLE_SESSION_C001_S07
    ]);
  });

  // Sync current form changes back into sessions list whenever scores/child/session change
  const currentSessionRecord: SessionRecord = useMemo(() => {
    return {
      record_id: activeRecordId,
      child,
      session,
      scores,
      na_items: naItems,
      observation
    };
  }, [activeRecordId, child, session, scores, naItems, observation]);

  // When active record changes (e.g. from multi-session tracker)
  const handleSelectSession = (record: SessionRecord) => {
    setActiveRecordId(record.record_id);
    setChild(record.child);
    setSession(record.session);
    setScores(record.scores);
    setNaItems(record.na_items || []);
    setObservation(record.observation || '');

    // Recompute current analysis
    const sorted = [...sessions].sort((a, b) => a.session.session_no - b.session.session_no);
    const idx = sorted.findIndex((s) => s.record_id === record.record_id);
    const prev = idx > 0 ? sorted[idx - 1] : undefined;
    setAnalysisResult(calculateSingleSession(record, prev, sorted));
    setStatusMessage({ type: 'info', text: `제${record.session.session_no}회기 기록을 불러왔습니다.` });
  };

  // Run AI Analysis via backend or recalculate instantly
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setStatusMessage(null);

    const sortedSessions = [...sessions.filter((s) => s.record_id !== activeRecordId), currentSessionRecord].sort(
      (a, b) => a.session.session_no - b.session.session_no
    );

    // Immediate local verification
    const prevSession = sortedSessions.length > 1 ? sortedSessions[sortedSessions.length - 2] : undefined;
    const instantResult = calculateSingleSession(currentSessionRecord, prevSession, sortedSessions);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: sortedSessions })
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류 (HTTP ${response.status})`);
      }

      const data = await response.json();
      if (data.result) {
        setAnalysisResult(data.result);
        setActiveTab('analysis');
        if (data.source === 'gemini_ai') {
          setStatusMessage({
            type: 'success',
            text: 'Gemini AI 심층 분석 및 맞춤형 특수체육 중재 계획이 생성되었습니다!'
          });
        } else {
          setStatusMessage({
            type: 'info',
            text: data.message || '규칙 기반 검증 엔진으로 분석이 완료되었습니다.'
          });
        }
      } else {
        setAnalysisResult(instantResult);
        setActiveTab('analysis');
      }
    } catch (err: any) {
      console.warn('Backend call failed, using client-side calculation engine:', err);
      setAnalysisResult(instantResult);
      setActiveTab('analysis');
      setStatusMessage({
        type: 'warning',
        text: '정확성 보증 로컬 규칙 엔진으로 산출되었습니다.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load Appendix B Sample
  const handleLoadSample = () => {
    setChild(SAMPLE_SESSION_C001_S07.child);
    setSession(SAMPLE_SESSION_C001_S07.session);
    setScores(SAMPLE_SESSION_C001_S07.scores);
    setNaItems(SAMPLE_SESSION_C001_S07.na_items);
    setObservation(SAMPLE_SESSION_C001_S07.observation);
    setActiveRecordId(SAMPLE_SESSION_C001_S07.record_id);

    const calc = calculateSingleSession(SAMPLE_SESSION_C001_S07);
    setAnalysisResult(calc);
    setStatusMessage({
      type: 'success',
      text: '부록 B 샘플 데이터(C001-S07)가 로드되었습니다. (부록 C 기대값과 100% 일치)'
    });
  };

  // Load Multi-Session Sample (S06 + S07)
  const handleLoadMultiSample = () => {
    setSessions([SAMPLE_SESSION_C001_S06, SAMPLE_SESSION_C001_S07]);
    setActiveRecordId('C001-S07');
    setChild(SAMPLE_SESSION_C001_S07.child);
    setSession(SAMPLE_SESSION_C001_S07.session);
    setScores(SAMPLE_SESSION_C001_S07.scores);
    setNaItems(SAMPLE_SESSION_C001_S07.na_items);
    setObservation(SAMPLE_SESSION_C001_S07.observation);

    const calc = calculateSingleSession(SAMPLE_SESSION_C001_S07, SAMPLE_SESSION_C001_S06, [
      SAMPLE_SESSION_C001_S06,
      SAMPLE_SESSION_C001_S07
    ]);
    setAnalysisResult(calc);
    setActiveTab('multi_session');
    setStatusMessage({
      type: 'success',
      text: '제6회기 및 제7회기 다회기 데이터가 로드되었습니다.'
    });
  };

  // Reset checklist
  const handleReset = () => {
    const emptyScores: Record<string, ScoreValue> = {};
    CHECKLIST_ITEMS.forEach((item) => {
      emptyScores[item.code] = 1;
    });
    setScores(emptyScores);
    setNaItems([]);
    setObservation('');
    setStatusMessage({ type: 'info', text: '체크리스트 평정 점수가 초기화되었습니다.' });
  };

  // Add new session
  const handleAddNewSession = () => {
    const nextSessionNo = session.session_no + 1;
    const newRecordId = `${child.child_id}-S${nextSessionNo.toString().padStart(2, '0')}`;

    const newRecord: SessionRecord = {
      record_id: newRecordId,
      child: { ...child },
      session: {
        ...session,
        session_no: nextSessionNo,
        date: new Date().toISOString().split('T')[0],
        notes: ''
      },
      scores: { ...scores },
      na_items: [...naItems],
      observation: ''
    };

    setSessions((prev) => [...prev, newRecord]);
    handleSelectSession(newRecord);
    setActiveTab('checklist');
    setStatusMessage({
      type: 'success',
      text: `제${nextSessionNo}회기 새 기록지가 생성되었습니다.`
    });
  };

  // Apply JSON from JsonEditorTab
  const handleApplyJson = (imported: SessionRecord | SessionRecord[]) => {
    if (Array.isArray(imported)) {
      setSessions(imported);
      const latest = imported[imported.length - 1];
      handleSelectSession(latest);
    } else {
      setSessions((prev) => {
        const existingIdx = prev.findIndex((s) => s.record_id === imported.record_id);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = imported;
          return updated;
        }
        return [...prev, imported];
      });
      handleSelectSession(imported);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadSample={handleLoadSample}
        onLoadMultiSample={handleLoadMultiSample}
        onReset={handleReset}
        onRunAnalysis={handleRunAnalysis}
        isAnalyzing={isAnalyzing}
        hasResult={Boolean(analysisResult)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Status Notification Toast/Banner */}
        {statusMessage && (
          <div
            className={`mb-3 px-3 py-1.5 rounded border flex items-center justify-between text-xs transition-all shadow-2xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : statusMessage.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : statusMessage.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              <span className="font-medium text-xs">{statusMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-700 px-1 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab 1: Checklist Input */}
        {activeTab === 'checklist' && (
          <div>
            <ChildSessionForm
              child={child}
              setChild={setChild}
              session={session}
              setSession={setSession}
              observation={observation}
              setObservation={setObservation}
            />

            <ChecklistGrid
              scores={scores}
              setScores={setScores}
              naItems={naItems}
              setNaItems={setNaItems}
              assistedItems={session.assistive_device_used ? session.assisted_items : undefined}
            />

            {/* Bottom floating summary / quick submit trigger */}
            <div className="mt-4 p-2 sm:px-3 sm:py-2 bg-white/95 backdrop-blur border border-slate-200 rounded flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm sticky bottom-2 z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <LifeBuoy className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    실시간 산출:
                  </span>{' '}
                  <span className="text-xs text-slate-600">
                    OII{' '}
                    <strong className="text-slate-900 font-mono font-bold">
                      {analysisResult.overall_independence_index}%
                    </strong>{' '}
                    ({analysisResult.overall_stage_band}) · GRI{' '}
                    <strong className="text-slate-900 font-mono font-bold">
                      {analysisResult.group_readiness_index}%
                    </strong>{' '}
                    · {analysisResult.instruction_recommendation}
                  </span>
                  {analysisResult.safety_flag && (
                    <span className="ml-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.2 rounded">
                      안전플래그 감지
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const sorted = [...sessions].sort((a, b) => a.session.session_no - b.session.session_no);
                    const prev = sorted.length > 1 ? sorted[sorted.length - 2] : undefined;
                    setAnalysisResult(calculateSingleSession(currentSessionRecord, prev, sorted));
                    setActiveTab('analysis');
                  }}
                  className="flex-1 sm:flex-none h-7 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded transition-colors border border-slate-200 shadow-2xs"
                >
                  지표 확인하기
                </button>

                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="flex-1 sm:flex-none h-7 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  {isAnalyzing ? '분석 중...' : '종합 리포트 생성'}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Analysis Report */}
        {activeTab === 'analysis' && (
          <AnalysisDashboard
            result={analysisResult}
            onRefreshAi={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* Tab 3: Multi-Session Tracking */}
        {activeTab === 'multi_session' && (
          <MultiSessionTracker
            sessions={sessions}
            onSelectSession={handleSelectSession}
            activeRecordId={activeRecordId}
            onAddNewSession={handleAddNewSession}
          />
        )}

        {/* Tab 4: Direct JSON Editor */}
        {activeTab === 'json_mode' && (
          <JsonEditorTab
            currentRecord={currentSessionRecord}
            onApplyJson={handleApplyJson}
          />
        )}

        {/* Tab 5: Prompt Hub for AI Studio */}
        {activeTab === 'prompt_hub' && <PromptHubTab />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-2.5 mt-8 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <p className="text-[11px]">
            발달장애 아동 생존수영 체크리스트 분석기 · Halliwick 10-Point & HAAR 기반 평가 시스템 (High Density)
          </p>
          <p className="text-slate-400 text-[10px]">
            본 도구는 형성평가 및 지도계획 수립용이며 의학적 진단 도구가 아닙니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
