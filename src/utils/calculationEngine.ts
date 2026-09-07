import {
  AnalysisResult,
  DomainScore,
  NextSessionGoal,
  ScoreValue,
  SessionRecord,
  StageBand,
  InstructionRecommendation
} from '../types';
import { CHECKLIST_ITEMS, DOMAINS } from '../constants/checklist';

export function getStageBand(pct: number): StageBand {
  if (pct <= 25) return '도입기';
  if (pct <= 50) return '초기 적응기';
  if (pct <= 75) return '기능 습득기';
  return '독립·일반화기';
}

export function calculateSingleSession(
  record: SessionRecord,
  previousRecord?: SessionRecord,
  allSessionsSorted?: SessionRecord[]
): AnalysisResult {
  const domainKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const domainScores: DomainScore[] = [];

  // Group items by domain
  const itemsByDomain: Record<string, typeof CHECKLIST_ITEMS> = {};
  for (const d of domainKeys) {
    itemsByDomain[d] = CHECKLIST_ITEMS.filter((item) => item.domain === d);
  }

  // 1 & 2. Domain calculations
  for (const d of domainKeys) {
    const items = itemsByDomain[d];
    let scored_items = 0;
    let raw_score = 0;

    for (const item of items) {
      const score = record.scores[item.code];
      if (score !== null && score !== undefined) {
        scored_items += 1;
        raw_score += score;
      }
    }

    if (scored_items > 0) {
      const max_score = 4 * scored_items;
      const achievement_pct = Math.round((raw_score / max_score) * 100 * 10) / 10;
      domainScores.push({
        domain: d,
        scored_items,
        raw_score,
        max_score,
        achievement_pct,
        stage_band: getStageBand(achievement_pct)
      });
    }
  }

  // 3. Overall Independence Index (OII)
  const totalDomainPct = domainScores.reduce((acc, curr) => acc + curr.achievement_pct, 0);
  const overall_independence_index =
    domainScores.length > 0
      ? Math.round((totalDomainPct / domainScores.length) * 10) / 10
      : 0;
  const overall_stage_band = getStageBand(overall_independence_index);

  // 4. Group Readiness Index (GRI) = average of B, C, D, I
  const griDomains = ['B', 'C', 'D', 'I'];
  const griScores = domainScores.filter((ds) => griDomains.includes(ds.domain));
  const griSum = griScores.reduce((acc, curr) => acc + curr.achievement_pct, 0);
  const group_readiness_index =
    griScores.length > 0 ? Math.round((griSum / griScores.length) * 10) / 10 : 0;

  // 6. Instruction Recommendation
  let instruction_recommendation: InstructionRecommendation = '1:1 지도 유지 권장';
  if (group_readiness_index >= 65) {
    instruction_recommendation = '그룹 편입 시도 가능';
  } else if (group_readiness_index >= 40) {
    instruction_recommendation = '1:1 유지 + 부분 그룹 병행';
  }

  // 7. Safety Flag check
  const safetyReasons: string[] = [];
  const hDomain = domainScores.find((d) => d.domain === 'H');
  if (hDomain && hDomain.achievement_pct < 40) {
    safetyReasons.push(`H영역(안전·자기구조 인식) 성취율 ${hDomain.achievement_pct}%로 40% 미만`);
  }

  const h2Score = record.scores['H2'];
  if (h2Score !== null && h2Score !== undefined && h2Score <= 1) {
    safetyReasons.push(`H2(물에 빠졌을 때 벽·사다리 잡기) ${h2Score}점으로 위기 대응 미흡`);
  }

  const h3Score = record.scores['H3'];
  if (h3Score !== null && h3Score !== undefined && h3Score <= 1) {
    safetyReasons.push(`H3(도움 요청 행동/신호 보내기) ${h3Score}점으로 신체/음성 구조요청 취약`);
  }

  const d4Score = record.scores['D4'];
  if (
    record.session.depth_zone === '깊은' &&
    d4Score !== null &&
    d4Score !== undefined &&
    d4Score <= 1
  ) {
    safetyReasons.push(`깊은 수심 구역에서 D4(수심 변화 수용) ${d4Score}점으로 패닉 위험`);
  }

  const safety_flag = safetyReasons.length > 0;
  const safety_reason = safetyReasons.join(' · ');

  // 8. Progress Note
  let progress_note = '기저선(baseline) 회기';
  if (previousRecord) {
    const prevCalc = calculateSingleSession(previousRecord);
    const domainDeltas: string[] = [];
    const itemDeltas: string[] = [];

    domainScores.forEach((curr) => {
      const prev = prevCalc.domain_scores.find((p) => p.domain === curr.domain);
      if (prev) {
        const delta = Math.round((curr.achievement_pct - prev.achievement_pct) * 10) / 10;
        const sign = delta > 0 ? `+${delta}` : `${delta}`;
        if (Math.abs(delta) >= 10) {
          domainDeltas.push(`${curr.domain}(${sign}%p 의미있는 진전)`);
        } else {
          domainDeltas.push(`${curr.domain}(${sign}%p)`);
        }
      }
    });

    CHECKLIST_ITEMS.forEach((item) => {
      const currVal = record.scores[item.code];
      const prevVal = previousRecord.scores[item.code];
      if (currVal !== null && prevVal !== null && currVal !== undefined && prevVal !== undefined) {
        const diff = currVal - prevVal;
        if (diff >= 1) {
          itemDeltas.push(`${item.code}(+${diff}점 상승)`);
        } else if (diff <= -1) {
          itemDeltas.push(`${item.code}(${diff}점 저하)`);
        }
      }
    });

    let stagnationNotice = '';
    if (allSessionsSorted && allSessionsSorted.length >= 3) {
      const last3 = allSessionsSorted.slice(-3);
      const oiiValues = last3.map((s) => calculateSingleSession(s).overall_independence_index);
      if (oiiValues[2] <= oiiValues[1] && oiiValues[1] <= oiiValues[0]) {
        stagnationNotice = ' ※ 3회기 연속 성취 정체·하락 경향으로 전략 재검토 필요.';
      }
    }

    progress_note = `직전 ${previousRecord.session.session_no}회기 대비 영역별 성취율 변화: ${domainDeltas.join(', ')}. 주요 문항 점수 변화: ${itemDeltas.length > 0 ? itemDeltas.join(', ') : '유의미한 단일 문항 변동 없음'}.${stagnationNotice}`;
  }

  // Strengths identification
  const sortedDomains = [...domainScores].sort((a, b) => b.achievement_pct - a.achievement_pct);
  const strengths: string[] = [];
  const topDomains = sortedDomains.slice(0, 2);
  topDomains.forEach((td) => {
    const meta = DOMAINS[td.domain];
    strengths.push(`${td.domain}영역(${meta.name}) 성취율 ${td.achievement_pct}% 달성 (${td.stage_band})`);
  });

  // Check 4-point items
  const perfectItems = CHECKLIST_ITEMS.filter((item) => record.scores[item.code] === 4);
  if (perfectItems.length > 0) {
    strengths.push(`독립 수행 강점 문항: ${perfectItems.map((i) => `${i.code}(${i.title})`).slice(0, 2).join(', ')}`);
  } else {
    const threeItems = CHECKLIST_ITEMS.filter((item) => record.scores[item.code] === 3);
    if (threeItems.length > 0) {
      strengths.push(`최소 촉진 수행 양호: ${threeItems.map((i) => `${i.code}(${i.title})`).slice(0, 2).join(', ')}`);
    }
  }

  // Priority needs identification (Safety items first)
  const priority_needs: string[] = [];
  if (safety_flag) {
    priority_needs.push(`[안전 최우선] ${safety_reason}`);
  }

  const bottomDomains = [...domainScores].sort((a, b) => a.achievement_pct - b.achievement_pct).slice(0, 2);
  bottomDomains.forEach((bd) => {
    const meta = DOMAINS[bd.domain];
    priority_needs.push(`${bd.domain}영역(${meta.name}) 기능 집중 보완 필요 (현재 ${bd.achievement_pct}%, ${bd.stage_band})`);
  });

  const lowItems = CHECKLIST_ITEMS.filter(
    (item) => record.scores[item.code] === 0 || record.scores[item.code] === 1
  );
  if (lowItems.length > 0 && priority_needs.length < 4) {
    const nonSafetyLow = lowItems.filter((i) => !['H2', 'H3'].includes(i.code)).slice(0, 2);
    if (nonSafetyLow.length > 0) {
      priority_needs.push(`집중 중재 문항: ${nonSafetyLow.map((i) => `${i.code}(${i.title})`).join(', ')}`);
    }
  }

  // Next session goals with special PE strategies
  const next_session_goals: NextSessionGoal[] = [];

  // Goal 1: Safety Wall Grab / Help Signal
  if (h2Score !== null && h2Score !== undefined && h2Score <= 1) {
    next_session_goals.push({
      domain: 'H',
      goal: '물에 빠졌을 때 풀 벽면 또는 레인 로프를 잡고 고개를 들어 호흡을 확보한다.',
      strategy: '백워드 체이닝(Backward Chaining) 및 레인 로프 시각 표지판을 활용한 반복 비상 포획 훈련'
    });
  } else if (h3Score !== null && h3Score !== undefined && h3Score <= 1) {
    next_session_goals.push({
      domain: 'H',
      goal: '위기 상황 발생 시 손을 머리 위로 들고 큰 소리로 도움을 요청한다.',
      strategy: '행동 시연 및 시각적 행동 단서 카드(도움 요청 PECS)를 활용한 음성·신체 동시 촉진'
    });
  }

  // Goal 2: Sensory / Halliwick Mental Adaptation
  if (d4Score !== null && d4Score !== undefined && d4Score <= 1) {
    next_session_goals.push({
      domain: 'D',
      goal: '교사의 손을 잡고 수심이 점진적으로 깊어지는 경계 지점에서 5초간 안정 상태를 유지한다.',
      strategy: 'Halliwick 정신적응(Mental Adaptation) 원리에 따른 점진적 노출 및 수중 장난감 유도 기법'
    });
  } else if (record.scores['D2'] !== null && record.scores['D2'] !== undefined && record.scores['D2'] <= 1) {
    next_session_goals.push({
      domain: 'D',
      goal: '얼굴에 손으로 물을 묻히거나 물방울이 닿았을 때 눈을 비비지 않고 3초 이상 안정성을 유지한다.',
      strategy: '체계적 둔감화(Systematic Desensitization) 및 스펀지·물뿌리개를 활용한 놀이 형태의 점진적 안면 접촉'
    });
  } else {
    next_session_goals.push({
      domain: 'E',
      goal: '물속에서 교사의 신체 보조를 점진적으로 줄이며 5초간 수직 기립 균형을 유지한다.',
      strategy: '신체보조 용암법(Most-to-Least Prompt Fading) 및 수중 기립 안정화 지지'
    });
  }

  // Goal 3: Breathing or Survival Float Core
  if (record.scores['F1'] !== null && record.scores['F1'] !== undefined && record.scores['F1'] <= 2) {
    next_session_goals.push({
      domain: 'F',
      goal: '수면에 입술을 대고 바람을 불어 규칙적인 버블링(물방울 만들기)을 3회 연속 수행한다.',
      strategy: '탁구공 불기 놀이를 통한 시각적 피드백 제공 및 입술 오므리기 모델링 촉진'
    });
  } else if (record.scores['G1'] !== null && record.scores['G1'] !== undefined && record.scores['G1'] <= 2) {
    next_session_goals.push({
      domain: 'G',
      goal: '부분 신체보조를 받아 양 무릎을 가슴으로 당겨 웅크린 새우등뜨기 자세를 3초간 유지한다.',
      strategy: 'Halliwick 구형 회전(Sagittal Rotation) 유도 및 허리·등 부위 수중 지지 용암법'
    });
  } else {
    next_session_goals.push({
      domain: 'G',
      goal: '누운 배면 자세(잎새뜨기)에서 지도자의 손바닥 지지를 받으며 5초 이상 얼굴을 수면 위로 유지한다.',
      strategy: '귀를 물에 담그는 청각 적응 둔감화와 후두부·견갑골 수평 받침을 통한 기도 확보 훈련'
    });
  }

  // Goal 4: Group & Communication transition
  if (record.scores['C5'] !== null && record.scores['C5'] !== undefined) {
    next_session_goals.push({
      domain: 'C',
      goal: '수영 활동 전 시각적 일정표(사진 카드)를 확인하고 제시된 순서에 따라 과제 장소로 이동한다.',
      strategy: '수중 방수 PECS 일정표 도입 및 활동 완료 시 토큰 스티커 보상 체계 적용'
    });
  }

  // Narrative summary (Adapted PE case note style)
  let narrative_summary = `${record.child.child_id} 아동은 제${record.session.session_no}회기 생존수영 수업에서 독립지수(OII) ${overall_independence_index}%(${overall_stage_band}), 그룹준비도(GRI) ${group_readiness_index}%를 나타내었음. `;
  narrative_summary += `${strengths[0] || '기본 입수 루틴'} 등의 영역에서 긍정적인 참여 의지를 보였으나, `;
  if (safety_flag) {
    narrative_summary += `비상 지지물 잡기 및 구조요청 등 안전 영역의 숙련도가 취약하여 안전 목표 달성 전까지 ${instruction_recommendation}을 유지하며 1:1 밀착 지도가 요구됨. `;
  } else {
    narrative_summary += `안전 규칙을 기본적으로 준수하며 향후 ${instruction_recommendation}에 따른 지도가 권고됨. `;
  }
  narrative_summary += `다음 회기에는 Halliwick 정신적응 및 감각 둔감화 전략을 병행하여 수중 안정성과 기본 생존 부력 기술을 단계적으로 형성해 나갈 계획임.`;

  return {
    child_id: record.child.child_id,
    session_no: record.session.session_no,
    domain_scores: domainScores,
    overall_independence_index,
    overall_stage_band,
    group_readiness_index,
    instruction_recommendation,
    safety_flag,
    safety_reason,
    strengths,
    priority_needs,
    next_session_goals,
    progress_note,
    narrative_summary,
    ai_generated: false,
    created_at: new Date().toISOString()
  };
}
