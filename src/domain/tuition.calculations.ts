import type {
  KpiMetrics,
  MajorName,
  MajorSummary,
  RegionSummary,
  TuitionRecord,
} from './tuition.types';

export const MAJORS: MajorName[] = ['인문사회', '자연과학', '예체능', '공학', '의학'];

export function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function calculateKpis(records: TuitionRecord[]): KpiMetrics {
  const average2025 = average(records.map((record) => record.tuition2025));
  const average2026 = average(records.map((record) => record.tuition2026));
  const increaseCount = records.filter((record) => record.changeType === '상승').length;

  return {
    schoolCount: records.length,
    average2025,
    average2026,
    averageDifference: average2026 - average2025,
    averageLevelRate: average2025 ? (average2026 / average2025 - 1) * 100 : 0,
    increaseCount,
    increaseRatio: records.length ? (increaseCount / records.length) * 100 : 0,
  };
}

export function summarizeRegions(records: TuitionRecord[]): RegionSummary[] {
  const groups = new Map<string, TuitionRecord[]>();
  records.forEach((record) => {
    const group = groups.get(record.region) ?? [];
    group.push(record);
    groups.set(record.region, group);
  });

  return [...groups.entries()]
    .map(([region, group]) => ({
      region,
      count: group.length,
      average2025: average(group.map((record) => record.tuition2025)),
      average2026: average(group.map((record) => record.tuition2026)),
      averageDifference: average(group.map((record) => record.difference)),
    }))
    .sort((a, b) => b.average2026 - a.average2026);
}

export function summarizeMajors(records: TuitionRecord[]): MajorSummary[] {
  return MAJORS.map((major) => {
    const comparable = records.filter(
      (record) =>
        record.majors[major].tuition2025 > 0 &&
        record.majors[major].tuition2026 > 0,
    );
    const average2025 = average(comparable.map((record) => record.majors[major].tuition2025));
    const average2026 = average(comparable.map((record) => record.majors[major].tuition2026));

    return {
      major,
      count: comparable.length,
      average2025,
      average2026,
      averageDifference: average2026 - average2025,
    };
  });
}

export function topSchools(records: TuitionRecord[], limit = 15): TuitionRecord[] {
  return [...records].sort((a, b) => b.tuition2026 - a.tuition2026).slice(0, limit);
}
