import { useEffect, useState } from 'react';
import { useDashboard } from '../../app/DashboardContext';
import type { ChangeType } from '../../domain/tuition.types';
import { downloadRecordsCsv } from '../../hooks/useCsvExport';

export function DashboardFilters() {
  const {
    filters,
    setFilter,
    resetFilters,
    regions,
    establishments,
    filteredRecords,
  } = useDashboard();
  const [query, setQuery] = useState(filters.query);

  useEffect(() => setQuery(filters.query), [filters.query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query !== filters.query) setFilter('query', query);
    }, 200);
    return () => window.clearTimeout(timer);
  }, [query, filters.query, setFilter]);

  return (
    <section className="filters" aria-label="대시보드 필터">
      <label className="control">
        <span>학교명 검색</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: 연세대학교, 제2캠퍼스"
        />
      </label>

      <label className="control">
        <span>지역</span>
        <select value={filters.region} onChange={(e) => setFilter('region', e.target.value)}>
          <option value="">전체 지역</option>
          {regions.map((region) => (
            <option key={region}>{region}</option>
          ))}
        </select>
      </label>

      <label className="control">
        <span>설립구분</span>
        <select
          value={filters.establishment}
          onChange={(e) => setFilter('establishment', e.target.value)}
        >
          <option value="">전체 설립구분</option>
          {establishments.map((establishment) => (
            <option key={establishment}>{establishment}</option>
          ))}
        </select>
      </label>

      <label className="control">
        <span>등록금 변동</span>
        <select
          value={filters.changeType}
          onChange={(e) => setFilter('changeType', e.target.value as ChangeType | '')}
        >
          <option value="">전체</option>
          <option value="상승">상승</option>
          <option value="동결">동결</option>
          <option value="하락">하락</option>
        </select>
      </label>

      <div className="filter-actions">
        <button className="button secondary" onClick={resetFilters}>
          초기화
        </button>
        <button className="button primary" onClick={() => downloadRecordsCsv(filteredRecords)}>
          CSV 저장
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        현재 {filteredRecords.length}개 학교·캠퍼스가 검색되었습니다.
      </p>
    </section>
  );
}
