import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { calculateSingleSession } from './src/utils/calculationEngine.ts';
import { AI_STUDIO_SYSTEM_PROMPT, AI_STUDIO_RESPONSE_SCHEMA } from './src/constants/checklist.ts';
import { SessionRecord } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API: Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // API: Analyze Session Checklist
  app.post('/api/analyze', async (req, res) => {
    try {
      const { records, forceLocalMath } = req.body;
      if (!records) {
        return res.status(400).json({ error: '회기 기록(records) 데이터가 누락되었습니다.' });
      }

      const recordList: SessionRecord[] = Array.isArray(records) ? records : [records];
      if (recordList.length === 0) {
        return res.status(400).json({ error: '유효한 회기 데이터가 없습니다.' });
      }

      // Sort by session_no ascending
      recordList.sort((a, b) => a.session.session_no - b.session.session_no);
      const latestRecord = recordList[recordList.length - 1];
      const prevRecord = recordList.length > 1 ? recordList[recordList.length - 2] : undefined;

      // Always calculate deterministic reference baseline to guarantee numerical integrity
      const exactMathResult = calculateSingleSession(latestRecord, prevRecord, recordList);

      // If user requested local math only or Gemini key is missing, return exact math calculation
      if (forceLocalMath || !process.env.GEMINI_API_KEY) {
        return res.json({
          result: exactMathResult,
          source: 'deterministic_engine',
          message: process.env.GEMINI_API_KEY
            ? '기계적 정확성 보증 엔진으로 계산되었습니다.'
            : 'Gemini API 키가 설정되지 않아 규칙 기반 계산 엔진으로 분석되었습니다.'
        });
      }

      // Execute Gemini AI analysis with the system prompt and structured schema
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const inputPayload = recordList.length === 1 ? recordList[0] : recordList;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: JSON.stringify(inputPayload, null, 2),
        config: {
          systemInstruction: AI_STUDIO_SYSTEM_PROMPT,
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: AI_STUDIO_RESPONSE_SCHEMA as any
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini API 응답 내용이 비어 있습니다.');
      }

      const parsedAiResult = JSON.parse(responseText);

      // Verify domain scores against exact math for any critical mismatch
      // Keep exact numerical percentage consistency while retaining rich AI narrative & goals
      const finalResult = {
        ...parsedAiResult,
        // Ensure mathematically verified domain scores & indices
        domain_scores: exactMathResult.domain_scores,
        overall_independence_index: exactMathResult.overall_independence_index,
        overall_stage_band: exactMathResult.overall_stage_band,
        group_readiness_index: exactMathResult.group_readiness_index,
        instruction_recommendation: exactMathResult.instruction_recommendation,
        safety_flag: exactMathResult.safety_flag,
        safety_reason: parsedAiResult.safety_reason || exactMathResult.safety_reason,
        ai_generated: true,
        created_at: new Date().toISOString()
      };

      return res.json({
        result: finalResult,
        source: 'gemini_ai',
        raw_ai: parsedAiResult
      });
    } catch (error: any) {
      console.error('Gemini Analysis error:', error);
      // Fallback seamlessly to exact local math calculation so user is never stranded
      const recordList: SessionRecord[] = Array.isArray(req.body.records) ? req.body.records : [req.body.records];
      if (recordList.length > 0 && recordList[0]?.scores) {
        recordList.sort((a, b) => a.session.session_no - b.session.session_no);
        const latest = recordList[recordList.length - 1];
        const prev = recordList.length > 1 ? recordList[recordList.length - 2] : undefined;
        const fallbackResult = calculateSingleSession(latest, prev, recordList);
        return res.json({
          result: fallbackResult,
          source: 'deterministic_engine_fallback',
          warning: `Gemini AI 분석 호출 중 오류(${error.message || 'Error'})가 발생하여 규칙 기반 분석 결과로 대체되었습니다.`
        });
      }

      return res.status(500).json({
        error: error.message || '분석 처리 중 오류가 발생했습니다.'
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
