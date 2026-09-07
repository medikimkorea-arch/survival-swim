import React, { useState } from 'react';
import { SessionRecord } from '../types';
import { SAMPLE_SESSION_C001_S07 } from '../constants/checklist';
import { Code2, Copy, Check, FileDown, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

interface JsonEditorTabProps {
  currentRecord: SessionRecord;
  onApplyJson: (record: SessionRecord | SessionRecord[]) => void;
}

export const JsonEditorTab: React.FC<JsonEditorTabProps> = ({
  currentRecord,
  onApplyJson
}) => {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(currentRecord, null, 2));
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSyncFromCurrent = () => {
    setJsonText(JSON.stringify(currentRecord, null, 2));
    setError(null);
    setSuccessMsg('현재 체크리스트 상태로 동기화되었습니다.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleLoadSample = () => {
    setJsonText(JSON.stringify(SAMPLE_SESSION_C001_S07, null, 2));
    setError(null);
    setSuccessMsg('부록 B 샘플 JSON이 로드되었습니다.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swim_checklist_${currentRecord.child.child_id}_S${currentRecord.session.session_no}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed) throw new Error('JSON 내용이 비어있습니다.');

      if (Array.isArray(parsed)) {
        if (parsed.length === 0) throw new Error('배열에 데이터가 없습니다.');
        onApplyJson(parsed);
      } else {
        if (!parsed.child || !parsed.session || !parsed.scores) {
          throw new Error('child, session, scores 필수 객체가 포함되어야 합니다.');
        }
        onApplyJson(parsed);
      }

      setError(null);
      setSuccessMsg('성공적으로 적용되었습니다! 체크리스트 탭 또는 분석 탭에서 확인하세요.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(`JSON 형식 오류: ${err.message}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div>
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-slate-700" />
              회기 기록 JSON 직접 편집 및 가져오기 (Direct JSON Editor)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-none">
              단일 회기 객체 또는 여러 회기 배열 [ ... ] 을 직접 입력하여 즉시 분석할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleSyncFromCurrent}
              className="h-7 px-2 text-xs text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 shadow-2xs"
            >
              현재값 동기화
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="h-7 px-2 text-xs text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 shadow-2xs"
            >
              부록 B 샘플 로드
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="h-7 px-2 text-xs text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 flex items-center gap-1 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              복사
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="h-7 px-2 text-xs text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 flex items-center gap-1 shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              다운로드
            </button>
          </div>
        </div>

        {error && (
          <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 text-xs flex items-center gap-2 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="relative">
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={16}
            className="w-full font-mono text-xs p-3 bg-slate-900 text-slate-100 rounded border border-slate-800 focus:outline-hidden focus:border-slate-600 leading-relaxed shadow-inner"
            placeholder="여기에 회기 JSON 데이터를 입력하세요..."
          />
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            문항 0~4 정수, 미실시는 null 표기 및 na_items에 등록
          </span>
          <button
            type="button"
            onClick={handleApply}
            className="h-7 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            체크리스트 및 분석에 적용
          </button>
        </div>
      </div>
    </div>
  );
};
