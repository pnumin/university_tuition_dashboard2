import type { DashboardFilters, TuitionRecord } from './tuition.types';

export function filterTuitionRecords(
  records: TuitionRecord[],
  filters: DashboardFilters,
): TuitionRecord[] {
  const query = filters.query.trim().toLocaleLowerCase('ko-KR');

  return records.filter((record) => {
    const matchesQuery =
      !query || record.school.toLocaleLowerCase('ko-KR').includes(query);
    const matchesRegion = !filters.region || record.region === filters.region;
    const matchesEstablishment =
      !filters.establishment || record.establishment === filters.establishment;
    const matchesChange =
      !filters.changeType || record.changeType === filters.changeType;

    return matchesQuery && matchesRegion && matchesEstablishment && matchesChange;
  });
}
