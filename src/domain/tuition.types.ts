export type ChangeType = '상승' | '동결' | '하락';
export type MajorName = '인문사회' | '자연과학' | '예체능' | '공학' | '의학';

export interface MajorTuition {
  tuition2025: number;
  tuition2026: number;
}

export interface TuitionRecord {
  school: string;
  region: string;
  establishment: string;
  status: string;
  tuition2025: number;
  tuition2026: number;
  difference: number;
  rate: number;
  changeType: ChangeType;
  majors: Record<MajorName, MajorTuition>;
}

export interface DashboardMetadata {
  appTitle: string;
  dataVersion: string;
  generatedAt: string;
  source: string;
  comparisonCount: number;
  increaseCount: number;
  freezeCount: number;
  decreaseCount: number;
  notes: string[];
}

export interface DashboardFilters {
  query: string;
  region: string;
  establishment: string;
  changeType: '' | ChangeType;
}

export interface KpiMetrics {
  schoolCount: number;
  average2025: number;
  average2026: number;
  averageDifference: number;
  averageLevelRate: number;
  increaseCount: number;
  increaseRatio: number;
}

export interface RegionSummary {
  region: string;
  count: number;
  average2025: number;
  average2026: number;
  averageDifference: number;
}

export interface MajorSummary {
  major: MajorName;
  count: number;
  average2025: number;
  average2026: number;
  averageDifference: number;
}
