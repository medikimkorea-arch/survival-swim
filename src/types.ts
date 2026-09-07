export type DisabilityType = '자폐성장애' | '지적장애' | '기타발달장애';
export type DisabilityLevel = '심함' | '중간' | '경도';
export type CommunicationLevel = '구어' | '부분구어' | '비구어(AAC)';
export type InstructionMode = '1:1' | '그룹';
export type DepthZone = '얕은' | '중간' | '깊은';
export type ConditionStatus = '양호' | '보통' | '불안정';
export type ItemType = 'support' | 'tolerance';

export type StageBand = '도입기' | '초기 적응기' | '기능 습득기' | '독립·일반화기';
export type InstructionRecommendation = '1:1 지도 유지 권장' | '1:1 유지 + 부분 그룹 병행' | '그룹 편입 시도 가능';

export interface ChildProfile {
  child_id: string;
  sex: '남' | '여';
  birth_ym: string;
  age_years: number;
  disability_type: DisabilityType;
  disability_level: DisabilityLevel;
  communication_level: CommunicationLevel;
}

export interface SessionInfo {
  date: string;
  session_no: number;
  instruction_mode: InstructionMode;
  instructor_id: string;
  water_temp_c: number;
  depth_zone: DepthZone;
  duration_min: number;
  condition: ConditionStatus;
  notes: string;
}

export type ScoreValue = 0 | 1 | 2 | 3 | 4 | null;

export interface ItemDefinition {
  code: string;
  domain: string;
  domainName: string;
  title: string;
  type: ItemType;
  frameworkNote?: string;
}

export interface DomainScore {
  domain: string;
  scored_items: number;
  raw_score: number;
  max_score: number;
  achievement_pct: number;
  stage_band: StageBand;
}

export interface NextSessionGoal {
  domain: string;
  goal: string;
  strategy: string;
}

export interface AnalysisResult {
  child_id: string;
  session_no: number;
  domain_scores: DomainScore[];
  overall_independence_index: number;
  overall_stage_band: StageBand;
  group_readiness_index: number;
  instruction_recommendation: InstructionRecommendation;
  safety_flag: boolean;
  safety_reason: string;
  strengths: string[];
  priority_needs: string[];
  next_session_goals: NextSessionGoal[];
  progress_note: string;
  narrative_summary: string;
  ai_generated?: boolean;
  created_at?: string;
}

export interface SessionRecord {
  record_id: string;
  child: ChildProfile;
  session: SessionInfo;
  scores: Record<string, ScoreValue>;
  na_items: string[];
  observation: string;
}
