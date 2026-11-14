import type { DashboardMetadata, TuitionRecord } from '../domain/tuition.types';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`데이터를 불러오지 못했습니다: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function loadDashboardData(): Promise<{
  records: TuitionRecord[];
  metadata: DashboardMetadata;
}> {
  const [records, metadata] = await Promise.all([
    fetchJson<TuitionRecord[]>('data/tuition-comparison.json'),
    fetchJson<DashboardMetadata>('data/metadata.json'),
  ]);

  return { records, metadata };
}
