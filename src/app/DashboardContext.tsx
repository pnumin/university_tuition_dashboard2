import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'react-router';
import { loadDashboardData } from '../data/tuition.repository';
import { calculateKpis, summarizeMajors, summarizeRegions } from '../domain/tuition.calculations';
import { filterTuitionRecords } from '../domain/tuition.filters';
import type {
  ChangeType,
  DashboardFilters,
  DashboardMetadata,
  KpiMetrics,
  MajorSummary,
  RegionSummary,
  TuitionRecord,
} from '../domain/tuition.types';

interface DashboardContextValue {
  records: TuitionRecord[];
  filteredRecords: TuitionRecord[];
  metadata: DashboardMetadata | null;
  loading: boolean;
  error: string | null;
  filters: DashboardFilters;
  regions: string[];
  establishments: string[];
  kpis: KpiMetrics;
  regionSummaries: RegionSummary[];
  majorSummaries: MajorSummary[];
  setFilter: (key: keyof DashboardFilters, value: string) => void;
  resetFilters: () => void;
  retry: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

const emptyFilters: DashboardFilters = {
  query: '',
  region: '',
  establishment: '',
  changeType: '',
};

export function DashboardProvider({ children }: PropsWithChildren) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState<TuitionRecord[]>([]);
  const [metadata, setMetadata] = useState<DashboardMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const filters: DashboardFilters = {
    query: searchParams.get('q') ?? '',
    region: searchParams.get('region') ?? '',
    establishment: searchParams.get('est') ?? '',
    changeType: (searchParams.get('change') as ChangeType | null) ?? '',
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    loadDashboardData()
      .then(({ records: nextRecords, metadata: nextMetadata }) => {
        if (!active) return;
        setRecords(nextRecords);
        setMetadata(nextMetadata);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(caught instanceof Error ? caught.message : '알 수 없는 오류가 발생했습니다.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const filteredRecords = useMemo(
    () => filterTuitionRecords(records, filters),
    [records, filters.query, filters.region, filters.establishment, filters.changeType],
  );

  const regions = useMemo(
    () => [...new Set(records.map((record) => record.region))].sort((a, b) => a.localeCompare(b, 'ko')),
    [records],
  );

  const establishments = useMemo(
    () =>
      [...new Set(records.map((record) => record.establishment))].sort((a, b) =>
        a.localeCompare(b, 'ko'),
      ),
    [records],
  );

  const kpis = useMemo(() => calculateKpis(filteredRecords), [filteredRecords]);
  const regionSummaries = useMemo(() => summarizeRegions(filteredRecords), [filteredRecords]);
  const majorSummaries = useMemo(() => summarizeMajors(filteredRecords), [filteredRecords]);

  const setFilter = (key: keyof DashboardFilters, value: string) => {
    const next = new URLSearchParams(searchParams);
    const paramMap: Record<keyof DashboardFilters, string> = {
      query: 'q',
      region: 'region',
      establishment: 'est',
      changeType: 'change',
    };
    const param = paramMap[key];

    if (value) next.set(param, value);
    else next.delete(param);

    next.delete('page');
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const value: DashboardContextValue = {
    records,
    filteredRecords,
    metadata,
    loading,
    error,
    filters: filters ?? emptyFilters,
    regions,
    establishments,
    kpis,
    regionSummaries,
    majorSummaries,
    setFilter,
    resetFilters,
    retry: () => setReloadKey((value) => value + 1),
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard는 DashboardProvider 안에서 사용해야 합니다.');
  }
  return context;
}
