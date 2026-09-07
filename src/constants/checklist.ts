import { ItemDefinition, SessionRecord } from '../types';

export interface DomainMeta {
  code: string;
  name: string;
  description: string;
  itemCount: number;
  framework: string;
}

export const DOMAINS: Record<string, DomainMeta> = {
  A: {
    code: 'A',
    name: '환경적응·사전준비',
    description: '수영장 환경 적응 및 입수 전 루틴/준비운동 수행',
    itemCount: 4,
    framework: 'HAAR / 기본생활자립'
  },
  B: {
    code: 'B',
    name: '정서·행동 조절',
    description: '입·퇴수 전이 수용, 낯선 과제 수용, 상동행동 조절',
    itemCount: 5,
    framework: '행동지원 / 전이중재'
  },
  C: {
    code: 'C',
    name: '의사소통·지시수행',
    description: '호명 반응, 1~2단계 지시수행, AAC/시각단서 수용',
    itemCount: 5,
    framework: '보완대체의사소통(AAC) / PECS'
  },
  D: {
    code: 'D',
    name: '감각처리 반응',
    description: '수온, 안면 입수, 물 튀김, 수심, 부력 감각 수용',
    itemCount: 5,
    framework: '감각통합 / HAAR'
  },
  E: {
    code: 'E',
    name: '수중 정신적응·균형(Halliwick)',
    description: '독립 입수, 수중 기립, 공간탐색, 회전조절, 손 떼기',
    itemCount: 5,
    framework: 'Halliwick 10-Point Programme'
  },
  F: {
    code: 'F',
    name: '호흡·부력 조절',
    description: '버블링, 잠수 호흡, 리듬호흡, 배면/복면 부력 유지',
    itemCount: 5,
    framework: '수중호흡 / 부력인지'
  },
  G: {
    code: 'G',
    name: '생존수영 핵심기술',
    description: '새우등뜨기, 잎새뜨기(대자 배면뜨기), 생존배영 이동',
    itemCount: 5,
    framework: '국내 생존수영 표준 매뉴얼'
  },
  H: {
    code: 'H',
    name: '안전·자기구조 인식',
    description: '수영장 안전규칙, 지지물 잡기, 도움 요청, 비상퇴수',
    itemCount: 5,
    framework: '자기구조 / 안전 역량'
  },
  I: {
    code: 'I',
    name: '그룹참여·사회적 상호작용',
    description: '차례 지키기, 평행참여, 또래 모방, 집단 지시 따르기',
    itemCount: 5,
    framework: '통합체육 / 그룹준비도'
  }
};

export const CHECKLIST_ITEMS: ItemDefinition[] = [
  // A. 환경적응·사전준비
  { code: 'A1', domain: 'A', domainName: '환경적응·사전준비', title: '탈의·샤워 등 입수 전 루틴 수행', type: 'support', frameworkNote: '루틴 자립도' },
  { code: 'A2', domain: 'A', domainName: '환경적응·사전준비', title: '수영장 환경(소음·울림·냄새) 내 정서 안정 유지', type: 'tolerance', frameworkNote: '수영장 청각·후각 내성' },
  { code: 'A3', domain: 'A', domainName: '환경적응·사전준비', title: '풀 데크(물가)에서 지시 대기·정렬', type: 'support', frameworkNote: '물가 안전 대기' },
  { code: 'A4', domain: 'A', domainName: '환경적응·사전준비', title: '입수 전 준비운동 참여', type: 'support', frameworkNote: '신체 가동성 준비' },

  // B. 정서·행동 조절
  { code: 'B1', domain: 'B', domainName: '정서·행동 조절', title: '입수 상황으로의 전이 수용', type: 'tolerance', frameworkNote: '전이 불안 조절' },
  { code: 'B2', domain: 'B', domainName: '정서·행동 조절', title: '새로운 활동/과제 도입 시 저항 없이 참여', type: 'tolerance', frameworkNote: '새 과제 거부감 완화' },
  { code: 'B3', domain: 'B', domainName: '정서·행동 조절', title: '좌절·불안 시 자기조절/진정 전략 사용', type: 'support', frameworkNote: '진정 전략 활용' },
  { code: 'B4', domain: 'B', domainName: '정서·행동 조절', title: '자기자극·상동행동이 수업 참여를 방해하지 않음', type: 'tolerance', frameworkNote: '상동행동 조절' },
  { code: 'B5', domain: 'B', domainName: '정서·행동 조절', title: '수업 종료·퇴수 전이 수용', type: 'tolerance', frameworkNote: '종료 전이 수용' },

  // C. 의사소통·지시수행
  { code: 'C1', domain: 'C', domainName: '의사소통·지시수행', title: '이름 호명 시 반응(주의 전환)', type: 'support', frameworkNote: '청각 주의집중' },
  { code: 'C2', domain: 'C', domainName: '의사소통·지시수행', title: '1단계 지시 이해·수행', type: 'support', frameworkNote: '단순 동작 지시' },
  { code: 'C3', domain: 'C', domainName: '의사소통·지시수행', title: '2단계 이상 연속 지시 수행', type: 'support', frameworkNote: '연속 과제 수행' },
  { code: 'C4', domain: 'C', domainName: '의사소통·지시수행', title: '요구·거부를 적절한 수단(말/제스처/AAC)으로 표현', type: 'support', frameworkNote: '기능적 의사소통' },
  { code: 'C5', domain: 'C', domainName: '의사소통·지시수행', title: '시각적 단서(그림카드·시범) 활용해 과제 이해', type: 'support', frameworkNote: '시각 지원 수용' },

  // D. 감각처리 반응
  { code: 'D1', domain: 'D', domainName: '감각처리 반응', title: '물 온도 적응(입수 시 과민반응 없음)', type: 'tolerance', frameworkNote: '온도 수용' },
  { code: 'D2', domain: 'D', domainName: '감각처리 반응', title: '얼굴·머리에 물 닿는 것 수용', type: 'tolerance', frameworkNote: '안면 감각방어' },
  { code: 'D3', domain: 'D', domainName: '감각처리 반응', title: '물 튀김·물보라 자극 수용', type: 'tolerance', frameworkNote: '비말 자극 내성' },
  { code: 'D4', domain: 'D', domainName: '감각처리 반응', title: '수심 변화(깊은 곳) 수용', type: 'tolerance', frameworkNote: '깊은 수심 적응' },
  { code: 'D5', domain: 'D', domainName: '감각처리 반응', title: '부력·물의 저항 감각 수용', type: 'tolerance', frameworkNote: '고유수용성 감각' },

  // E. 수중 정신적응·균형(Halliwick)
  { code: 'E1', domain: 'E', domainName: '수중 정신적응·균형', title: '독립 입수(사다리·계단·미끄러지듯)', type: 'support', frameworkNote: 'Halliwick 정신적응' },
  { code: 'E2', domain: 'E', domainName: '수중 정신적응·균형', title: '물속에서 지지물 없이 서기·자세 유지', type: 'support', frameworkNote: '정적 균형' },
  { code: 'E3', domain: 'E', domainName: '수중 정신적응·균형', title: '물속 이동(걷기)으로 공간 탐색', type: 'support', frameworkNote: '동적 균형 / 공간탐색' },
  { code: 'E4', domain: 'E', domainName: '수중 정신적응·균형', title: '균형 흐트러진 뒤 안정 자세 회복(회전조절)', type: 'support', frameworkNote: 'Halliwick 회전조절' },
  { code: 'E5', domain: 'E', domainName: '수중 정신적응·균형', title: '지지물(벽·바)에서 손 떼기(disengagement)', type: 'support', frameworkNote: '지지물 이탈 자립' },

  // F. 호흡·부력 조절
  { code: 'F1', domain: 'F', domainName: '호흡·부력 조절', title: '입으로 불기(버블링)', type: 'support', frameworkNote: '수면 호기' },
  { code: 'F2', domain: 'F', domainName: '호흡·부력 조절', title: '얼굴 담그고 숨 참기(3초 이상)', type: 'support', frameworkNote: '안면 침수 호흡정지' },
  { code: 'F3', domain: 'F', domainName: '호흡·부력 조절', title: '코·입으로 리듬 호흡', type: 'support', frameworkNote: '리듬 호흡조절' },
  { code: 'F4', domain: 'F', domainName: '호흡·부력 조절', title: '도움받아 뜨기(배면/복면)', type: 'support', frameworkNote: '보조 부력 경험' },
  { code: 'F5', domain: 'F', domainName: '호흡·부력 조절', title: '독립적으로 뜨기 유지', type: 'support', frameworkNote: '독립 부력 유지' },

  // G. 생존수영 핵심기술
  { code: 'G1', domain: 'G', domainName: '생존수영 핵심기술', title: '새우등뜨기(웅크려 뜨기)', type: 'support', frameworkNote: '생존 웅크리기' },
  { code: 'G2', domain: 'G', domainName: '생존수영 핵심기술', title: '잎새뜨기(누워 뜨기/생존뜨기, 대자 배면뜨기)', type: 'support', frameworkNote: '배면 생존자세' },
  { code: 'G3', domain: 'G', domainName: '생존수영 핵심기술', title: '잎새뜨기 자세 유지(10초 이상)', type: 'support', frameworkNote: '기도확보 부유 지속' },
  { code: 'G4', domain: 'G', domainName: '생존수영 핵심기술', title: '뜬 자세에서 이동(발차기/스컬링)', type: 'support', frameworkNote: '수평 추진' },
  { code: 'G5', domain: 'G', domainName: '생존수영 핵심기술', title: '생존배영으로 짧은 거리(5m 내외) 이동', type: 'support', frameworkNote: '생존 배영' },

  // H. 안전·자기구조 인식
  { code: 'H1', domain: 'H', domainName: '안전·자기구조 인식', title: '위험 상황·안전규칙 인식(뛰지 않기·지정구역)', type: 'support', frameworkNote: '풀 안전규칙' },
  { code: 'H2', domain: 'H', domainName: '안전·자기구조 인식', title: '물에 빠졌을 때 벽·사다리·라인 잡기', type: 'support', frameworkNote: '비상 잡기(핵심)' },
  { code: 'H3', domain: 'H', domainName: '안전·자기구조 인식', title: '도움 요청 행동(손 들기·소리치기)', type: 'support', frameworkNote: '구조신호(핵심)' },
  { code: 'H4', domain: 'H', domainName: '안전·자기구조 인식', title: '구조기구(킥판·튜브) 잡고 뜨기 유지', type: 'support', frameworkNote: '부유물 활용' },
  { code: 'H5', domain: 'H', domainName: '안전·자기구조 인식', title: '안전하게 퇴수하기', type: 'support', frameworkNote: '안전 퇴수' },

  // I. 그룹참여·사회적 상호작용
  { code: 'I1', domain: 'I', domainName: '그룹참여·사회적 상호작용', title: '순서 기다리기', type: 'support', frameworkNote: '차례 지키기' },
  { code: 'I2', domain: 'I', domainName: '그룹참여·사회적 상호작용', title: '또래 곁에서 활동 병행(평행 참여)', type: 'tolerance', frameworkNote: '평행 놀이/참여' },
  { code: 'I3', domain: 'I', domainName: '그룹참여·사회적 상호작용', title: '또래·교사와 상호작용(모방·주고받기)', type: 'support', frameworkNote: '사회적 상호작용' },
  { code: 'I4', domain: 'I', domainName: '그룹참여·사회적 상호작용', title: '집단(전체 대상) 지시 따르기', type: 'support', frameworkNote: '그룹 지시수행' },
  { code: 'I5', domain: 'I', domainName: '그룹참여·사회적 상호작용', title: '그룹 대형 유지·이탈하지 않기', type: 'support', frameworkNote: '이탈 방지' }
];

export const RUBRIC_INFO = {
  support: {
    title: '기술 수행(support) 루브릭',
    levels: [
      { score: 1, label: '1점 - 수행불가/거부', desc: '과제 수행을 거부하거나 신체보조를 주어도 전혀 동작을 형성하지 못함' },
      { score: 2, label: '2점 - 최대지원', desc: '지도자의 전적인 신체보조(Full physical prompt)로 과제 완수' },
      { score: 3, label: '3점 - 중간지원', desc: '부분 신체보조(손목/허리 받침) 또는 반복적인 모델링·시각촉진 필요' },
      { score: 4, label: '4점 - 최소지원', desc: '1~2회의 언어적 촉진이나 가벼운 제스처만으로 성공' },
      { score: 5, label: '5점 - 독립수행', desc: '도움 없이 스스로 바른 자세로 수행하며 다른 환경에서도 일반화됨' }
    ]
  },
  tolerance: {
    title: '정서·감각(tolerance) 루브릭',
    levels: [
      { score: 1, label: '1점 - 극심한 부정반응', desc: '패닉, 격렬한 울음, 도망 또는 물 밖으로 탈출 시도' },
      { score: 2, label: '2점 - 강한 부정반응', desc: '지속적인 칭얼거림, 몸 굳어짐, 활동 재개에 상당한 시간 소요' },
      { score: 3, label: '3점 - 중간 내성', desc: '초기 저항이 있으나 달램 및 시각단서 제공 시 재개 가능' },
      { score: 4, label: '4점 - 경미한 반응', desc: '일시적 찌푸림이 있으나 스스로 호흡을 가다듬고 조절함' },
      { score: 5, label: '5점 - 안정적 수용', desc: '불안이나 거부감 없이 즐겁고 편안하게 자극을 수용함' }
    ]
  }
};

// Appendix B sample data
export const SAMPLE_SESSION_C001_S07: SessionRecord = {
  record_id: 'C001-S07',
  child: {
    child_id: 'C001',
    sex: '남',
    birth_ym: '2017-04',
    age_years: 9.4,
    disability_type: '자폐성장애',
    disability_level: '중간',
    communication_level: '부분구어'
  },
  session: {
    date: '2026-09-03',
    session_no: 7,
    instruction_mode: '1:1',
    instructor_id: 'T-KIM',
    water_temp_c: 30.5,
    depth_zone: '얕은',
    duration_min: 40,
    condition: '보통',
    notes: '입수 초반 5분 저항, 시각일정표 제시 후 진정.',
    assistive_device_used: true,
    assistive_device_types: ['팔뜨개·암밴드', '킥판'],
    assisted_items: ['F4', 'G2']
  },
  scores: {
    A1: 3, A2: 2, A3: 3, A4: 3,
    B1: 2, B2: 2, B3: 2, B4: 3, B5: 3,
    C1: 3, C2: 4, C3: 2, C4: 3, C5: 4,
    D1: 3, D2: 2, D3: 2, D4: 1, D5: 3,
    E1: 3, E2: 3, E3: 4, E4: 2, E5: 2,
    F1: 3, F2: 2, F3: 2, F4: 3, F5: 1,
    G1: 2, G2: 1, G3: 1, G4: 1, G5: null,
    H1: 3, H2: 2, H3: 2, H4: 3, H5: 3,
    I1: 2, I2: 3, I3: 2, I4: 2, I5: 2
  },
  na_items: ['G5'],
  observation: '얼굴에 물 닿는 자극(D2)에 회피 강함. 새우등뜨기는 신체보조 시 1~2초 유지. 그룹 소음에 예민.'
};

// Prior baseline session for multi-session progress demonstration (C001-S06)
export const SAMPLE_SESSION_C001_S06: SessionRecord = {
  record_id: 'C001-S06',
  child: {
    child_id: 'C001',
    sex: '남',
    birth_ym: '2017-04',
    age_years: 9.4,
    disability_type: '자폐성장애',
    disability_level: '중간',
    communication_level: '부분구어'
  },
  session: {
    date: '2026-08-27',
    session_no: 6,
    instruction_mode: '1:1',
    instructor_id: 'T-KIM',
    water_temp_c: 30.2,
    depth_zone: '얕은',
    duration_min: 40,
    condition: '불안정',
    notes: '물소리와 수영장 울림에 불안감 지속. 데크에서 입수까지 15분 소요.',
    assistive_device_used: true,
    assistive_device_types: ['팔뜨개·암밴드', '부력조끼·구명조끼'],
    assisted_items: ['F3', 'F4', 'G1', 'G2']
  },
  scores: {
    A1: 2, A2: 1, A3: 2, A4: 2,
    B1: 1, B2: 1, B3: 2, B4: 2, B5: 2,
    C1: 3, C2: 3, C3: 1, C4: 2, C5: 3,
    D1: 2, D2: 1, D3: 1, D4: 1, D5: 2,
    E1: 2, E2: 2, E3: 3, E4: 1, E5: 1,
    F1: 2, F2: 1, F3: 1, F4: 2, F5: 1,
    G1: 1, G2: 1, G3: 1, G4: 1, G5: null,
    H1: 2, H2: 1, H3: 1, H4: 2, H5: 2,
    I1: 1, I2: 2, I3: 1, I4: 1, I5: 1
  },
  na_items: ['G5'],
  observation: '물에 들어가는 것 자체에 강한 저항. 물안경 착용 거부. 시각일정표 미도입 상태.'
};

export const AI_STUDIO_SYSTEM_PROMPT = `당신은 발달장애(자폐성·지적장애 중심) 아동의 생존수영 지도 데이터를 분석하는
특수체육(Adapted PE)·수중재활운동 전문 분석가다. 근거 프레임워크는 Halliwick 10-Point
Programme(수중 정신적응·균형·회전조절), HAAR(자폐 아동 수중준비도 평가), 국내 생존수영
핵심기술(새우등뜨기·잎새뜨기·생존배영)이다.

입력은 '발달장애 아동 생존수영 체크리스트' 회기 기록(JSON)이다. 한 건 또는 여러 건(배열)이
올 수 있다. 너의 임무는 아래 규칙을 '기계적으로 정확하게' 계산하고 지정된 형식으로만 출력하는 것이다.

■ 입력 구조
- child: child_id, sex, birth_ym, age_years, disability_type(자폐성장애/지적장애/기타발달장애),
  disability_level(심함/중간/경도), communication_level(구어/부분구어/비구어(AAC))
- session: date, session_no, instruction_mode(1:1/그룹), instructor_id, water_temp_c,
  depth_zone(얕은/중간/깊은), duration_min, condition(양호/보통/불안정), notes,
  assistive_device_used(boolean: 착용 여부),
  assistive_device_types(배열: 팔뜨개·암밴드 / 킥판 / 부력조끼·구명조끼 / 튜브·웨이트벨트 / 기타),
  assisted_items(보조기구 착용 수행 문항 코드 배열, 예: ["F4","G2"])
- scores: 44문항 점수. 각 문항 1~5 정수 또는 null(미실시)
- na_items: 미실시 문항 코드 배열. observation: 행동관찰 자유서술

■ 44문항 정의 (코드 첫 글자 = 영역)
[A 환경적응·사전준비]
 A1 탈의·샤워 등 입수 전 루틴 수행(support)
 A2 수영장 환경(소음·울림·냄새) 내 정서 안정 유지(tolerance)
 A3 풀 데크(물가)에서 지시 대기·정렬(support)
 A4 입수 전 준비운동 참여(support)
[B 정서·행동 조절]
 B1 입수 상황으로의 전이 수용(tolerance)
 B2 새로운 활동/과제 도입 시 저항 없이 참여(tolerance)
 B3 좌절·불안 시 자기조절/진정 전략 사용(support)
 B4 자기자극·상동행동이 수업 참여를 방해하지 않음(tolerance)
 B5 수업 종료·퇴수 전이 수용(tolerance)
[C 의사소통·지시수행]
 C1 이름 호명 시 반응(주의 전환)(support)
 C2 1단계 지시 이해·수행(support)
 C3 2단계 이상 연속 지시 수행(support)
 C4 요구·거부를 적절한 수단(말/제스처/AAC)으로 표현(support)
 C5 시각적 단서(그림카드·시범) 활용해 과제 이해(support)
[D 감각처리 반응]
 D1 물 온도 적응(입수 시 과민반응 없음)(tolerance)
 D2 얼굴·머리에 물 닿는 것 수용(tolerance)
 D3 물 튀김·물보라 자극 수용(tolerance)
 D4 수심 변화(깊은 곳) 수용(tolerance)
 D5 부력·물의 저항 감각 수용(tolerance)
[E 수중 정신적응·균형(Halliwick)]
 E1 독립 입수(사다리·계단·미끄러지듯)(support)
 E2 물속에서 지지물 없이 서기·자세 유지(support)
 E3 물속 이동(걷기)으로 공간 탐색(support)
 E4 균형 흐트러진 뒤 안정 자세 회복(회전조절)(support)
 E5 지지물(벽·바)에서 손 떼기(disengagement)(support)
[F 호흡·부력 조절]
 F1 입으로 불기(버블링)(support)
 F2 얼굴 담그고 숨 참기(3초 이상)(support)
 F3 코·입으로 리듬 호흡(support)
 F4 도움받아 뜨기(배면/복면)(support)
 F5 독립적으로 뜨기 유지(support)
[G 생존수영 핵심기술]
 G1 새우등뜨기(웅크려 뜨기)(support)
 G2 잎새뜨기(누워 뜨기/생존뜨기, 대자 배면뜨기)(support)
 G3 잎새뜨기 자세 유지(10초 이상)(support)
 G4 뜬 자세에서 이동(발차기/스컬링)(support)
 G5 생존배영으로 짧은 거리(5m 내외) 이동(support)
[H 안전·자기구조 인식]
 H1 위험 상황·안전규칙 인식(뛰지 않기·지정구역)(support)
 H2 물에 빠졌을 때 벽·사다리·라인 잡기(support)
 H3 도움 요청 행동(손 들기·소리치기)(support)
 H4 구조기구(킥판·튜브) 잡고 뜨기 유지(support)
 H5 안전하게 퇴수하기(support)
[I 그룹참여·사회적 상호작용]
 I1 순서 기다리기(support)
 I2 또래 곁에서 활동 병행(평행 참여)(tolerance)
 I3 또래·교사와 상호작용(모방·주고받기)(support)
 I4 집단(전체 대상) 지시 따르기(support)
 I5 그룹 대형 유지·이탈하지 않기(support)

영역명: A=환경적응·사전준비, B=정서·행동 조절, C=의사소통·지시수행, D=감각처리 반응,
E=수중 정신적응·균형, F=호흡·부력 조절, G=생존수영 핵심기술, H=안전·자기구조 인식,
I=그룹참여·사회적 상호작용.

■ 채점 루브릭(1~5점) — 참고용(점수는 입력에서 주어짐)
support(기술 수행): 1 수행불가/거부 · 2 최대지원(전적 신체보조) · 3 중간지원(부분 신체보조/반복촉진)
 · 4 최소지원(언어·시각촉진 1~2회) · 5 독립수행(일반화)
tolerance(정서·감각): 1 극심한 부정반응(패닉/회피) · 2 강한 부정반응 · 3 중간(촉진 시 재개)
 · 4 경미(스스로 조절) · 5 안정적 수용

■ 계산 규칙 (반드시 이 순서)
1. null 문항은 모든 계산에서 제외.
2. 영역별: scored_items=비-null 문항수, raw_score=점수합, max_score=5×scored_items,
   achievement_pct=round(((raw_score - scored_items) / (4 * scored_items)) * 100, 1). scored_items=0이면 그 영역 제외.
   (단, 최저점인 1점 평정 시 성취율은 정확히 0%, 최고점인 5점 평정 시 성취율은 100%가 됨)
3. overall_independence_index(OII)=채점된 영역들의 achievement_pct 단순평균(소수1자리).
4. group_readiness_index(GRI)=영역 B,C,D,I 의 achievement_pct 평균(소수1자리).
5. 성취 밴드: 0–25 도입기 / 26–50 초기 적응기 / 51–75 기능 습득기 / 76–100 독립·일반화기.
6. instruction_recommendation(GRI 기준):
   GRI<40 → "1:1 지도 유지 권장"
   40≤GRI<65 → "1:1 유지 + 부분 그룹 병행"
   GRI≥65 → "그룹 편입 시도 가능"
7. safety_flag=true 조건(하나라도): H영역 achievement_pct<40, 또는 H2≤2 또는 H3≤2,
   또는 (D4≤2 이면서 session.depth_zone=="깊은"). true면 safety_reason에 사유 명시하고,
   권고가 "그룹 편입 시도 가능"이라도 narrative_summary에서 '안전 목표 우선, 그룹 확대 보류' 권고.
8. 여러 회기(배열): 같은 child_id를 session_no 오름차순으로 보고 최근 회기 기준으로 지표 산출.
   progress_note에 직전 회기 대비 영역별 Δ성취율·문항 주요변화(±1점 이상) 서술. 의미있는 진전=
   문항 +1 이상 또는 영역 +10%p 이상. 3회기 연속 정체·하락이면 '전략 재검토 필요' 명시.
   단일 회기면 progress_note에 "기저선(baseline) 회기"라고 서술.
9. 보조기구(Assistive Devices) 평가 원칙 및 규칙:
   - session.assistive_device_used가 true인 경우, 보조기구 착용 상태에서 나온 점수(특히 F·G 부력·뜨기 문항)는 '독립 부력'으로 오해하지 않도록 narrative_summary와 priority_needs에서 그 사실(보조기구 착용 및 의존성)을 반드시 명시할 것.
   - 보조기구 착용 문항(assisted_items)은 next_session_goals에서 '점진적 보조기구 제거(용암법/Prompt & Device Fading: 암밴드 공기압 점진 감압, 킥판 파지 면적 축소, 부력재 분리 등)'를 핵심 중재 전략으로 제안할 것.

■ 해석·서술 규칙
- strengths(2~4개): 상위 성취율 영역·5점 문항 근거.
- priority_needs(2~4개): 하위 성취율 영역·1~2점 문항·안전플래그 근거. 안전관련 최우선 배치. 보조기구 착용 시 보조기구 의존성 및 자력 수행 확인 필요성 명시.
- next_session_goals(3~5개): 각 목표는 현 수준보다 한 단계 위 + 관찰가능하게 + strategy에
  특수체육·수중재활 중재전략(Halliwick 정신적응·회전조절, 백워드 체이닝, 시각적 일정표·PECS,
  점진적 노출/둔감화, 신체보조 용암법, 점진적 보조기구 제거(Device Fading) 등) 명시.
- narrative_summary: 장애인복지관 사례기록 문체(정중한 '~함/~임' 또는 '~하였다')로 3~5문장.
  낙인적 표현 금지, 강점 기반 기술. 보조기구 착용 시 독립 부력 오인 방지 및 용암법 계획을 반드시 서술.

■ 금지·주의
- 형성평가·지도계획용이며 의학적 진단이 아니다. 진단·병명추정·예후단정 금지.
- 입력에 없는 점수를 상상하거나 null을 0으로 취급하지 말 것.
- 지정된 JSON 형식으로만 출력하고 그 외 텍스트를 덧붙이지 말 것.
- 계산은 소수 1자리 반올림, 백분율 0~100.`;

export const AI_STUDIO_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    child_id: { type: "string" },
    session_no: { type: "integer" },
    domain_scores: {
      type: "array",
      items: {
        type: "object",
        properties: {
          domain: { type: "string" },
          scored_items: { type: "integer" },
          raw_score: { type: "integer" },
          max_score: { type: "integer" },
          achievement_pct: { type: "number" },
          stage_band: { type: "string", enum: ["도입기", "초기 적응기", "기능 습득기", "독립·일반화기"] }
        },
        required: ["domain", "scored_items", "raw_score", "max_score", "achievement_pct", "stage_band"]
      }
    },
    overall_independence_index: { type: "number" },
    overall_stage_band: { type: "string", enum: ["도입기", "초기 적응기", "기능 습득기", "독립·일반화기"] },
    group_readiness_index: { type: "number" },
    instruction_recommendation: { type: "string", enum: ["1:1 지도 유지 권장", "1:1 유지 + 부분 그룹 병행", "그룹 편입 시도 가능"] },
    safety_flag: { type: "boolean" },
    safety_reason: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    priority_needs: { type: "array", items: { type: "string" } },
    next_session_goals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          domain: { type: "string" },
          goal: { type: "string" },
          strategy: { type: "string" }
        },
        required: ["domain", "goal", "strategy"]
      }
    },
    progress_note: { type: "string" },
    narrative_summary: { type: "string" }
  },
  required: [
    "child_id",
    "session_no",
    "domain_scores",
    "overall_independence_index",
    "overall_stage_band",
    "group_readiness_index",
    "instruction_recommendation",
    "safety_flag",
    "strengths",
    "priority_needs",
    "next_session_goals",
    "narrative_summary"
  ]
};
