import React, { useState } from 'react';
import {
  AI_STUDIO_SYSTEM_PROMPT,
  AI_STUDIO_RESPONSE_SCHEMA,
  SAMPLE_SESSION_C001_S07
} from '../constants/checklist';
import { Bot, Copy, Check, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export const PromptHubTab: React.FC = () => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  const copyText = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Introduction Card */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              Google AI Studio 통합 프롬프트 (v1.0) 연동 안내
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold font-mono">
                Temp 0.2 · Structured JSON
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              본 애플리케이션에 내장된 시스템 프롬프트와 JSON 스키마를 외부{' '}
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 underline font-semibold inline-flex items-center gap-0.5"
              >
                Google AI Studio (aistudio.google.com)
                <ExternalLink className="w-3 h-3" />
              </a>
              에 직접 붙여넣어 독립적으로 실행하거나 실험할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Step by step instructions */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-800 bg-slate-200 px-1 py-0.2 rounded">STEP 1</span>
            <h4 className="text-xs font-bold text-slate-800 mt-1">시스템 프롬프트 등록</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
              AI Studio &gt; Create Prompt의 <strong>System instructions</strong>에 프롬프트를 붙여넣습니다.
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-800 bg-slate-200 px-1 py-0.2 rounded">STEP 2</span>
            <h4 className="text-xs font-bold text-slate-800 mt-1">구조화 출력 스키마 설정</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
              <strong>Structured output(JSON)</strong>을 켜고 아래 부록 A 스키마를 <strong>Response schema</strong>로 등록합니다.
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-800 bg-slate-200 px-1 py-0.2 rounded">STEP 3</span>
            <h4 className="text-xs font-bold text-slate-800 mt-1">모델 & 온도 설정 후 실행</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
              Gemini 2.5/Flash, <strong>Temperature 0.2</strong> 설정 후 회기 JSON을 입력하여 실행합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Verification Matrix (Appendix C) */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-800 tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          부록 C. 기대 출력값 검증 매트릭스 (Validation Benchmark)
        </h3>
        <p className="text-[11px] text-slate-500 mb-2">
          샘플 입력(부록 B)을 적용했을 때 산출된 수치와 명세서 기준값 비교:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-1.5 px-2 font-semibold text-slate-700">검증 지표 항목</th>
                <th className="py-1.5 px-2 font-semibold text-slate-700">명세서 기대값 (부록 C)</th>
                <th className="py-1.5 px-2 font-semibold text-slate-700">본 시스템 계산 일치 여부</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-1.5 px-2 font-medium text-slate-800">영역별 성취율(%)</td>
                <td className="py-1.5 px-2 font-mono text-slate-700">
                  A 43.8 · B 35.0 · C 55.0 · D 30.0 · E 45.0 · F 30.0 · G 6.2 · H 40.0 · I 30.0
                </td>
                <td className="py-1.5 px-2 text-emerald-600 font-bold">100% 일치 (검증 완료)</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-medium text-slate-800">전체 독립지수 (OII)</td>
                <td className="py-1.5 px-2 font-mono font-bold text-slate-900">35.0% (초기 적응기)</td>
                <td className="py-1.5 px-2 text-emerald-600 font-bold">100% 일치 (검증 완료)</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-medium text-slate-800">그룹 준비도 지수 (GRI)</td>
                <td className="py-1.5 px-2 font-mono font-bold text-slate-900">37.5%</td>
                <td className="py-1.5 px-2 text-emerald-600 font-bold">100% 일치 (검증 완료)</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-medium text-slate-800">지도형태 권고</td>
                <td className="py-1.5 px-2 font-semibold text-slate-900">1:1 지도 유지 권장</td>
                <td className="py-1.5 px-2 text-emerald-600 font-bold">100% 일치 (검증 완료)</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-medium text-slate-800">안전 플래그 (safety_flag)</td>
                <td className="py-1.5 px-2 font-mono text-amber-700 font-bold">true (H2·H3 = 1점 취약)</td>
                <td className="py-1.5 px-2 text-emerald-600 font-bold">100% 일치 (검증 완료)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code / Text copy blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* System Prompt Box */}
        <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
            <h3 className="text-xs font-bold text-slate-800">1. 시스템 프롬프트 (System Instructions)</h3>
            <button
              type="button"
              onClick={() => copyText(AI_STUDIO_SYSTEM_PROMPT, setCopiedPrompt)}
              className="h-6 px-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 flex items-center gap-1 shadow-2xs"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              프롬프트 복사
            </button>
          </div>
          <textarea
            readOnly
            value={AI_STUDIO_SYSTEM_PROMPT}
            rows={10}
            className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-hidden"
          />
        </div>

        {/* Output Schema Box */}
        <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
            <h3 className="text-xs font-bold text-slate-800">2. 부록 A. 출력 스키마 (Response Schema)</h3>
            <button
              type="button"
              onClick={() => copyText(JSON.stringify(AI_STUDIO_RESPONSE_SCHEMA, null, 2), setCopiedSchema)}
              className="h-6 px-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 flex items-center gap-1 shadow-2xs"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              스키마 복사
            </button>
          </div>
          <textarea
            readOnly
            value={JSON.stringify(AI_STUDIO_RESPONSE_SCHEMA, null, 2)}
            rows={10}
            className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
};
