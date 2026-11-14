import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useDashboard } from '../../app/DashboardContext';
import { formatPercent, formatWon } from '../../domain/tuition.formatters';
import type { TuitionRecord } from '../../domain/tuition.types';
import { downloadRecordsCsv } from '../../hooks/useCsvExport';

type SortKey =
  | 'school'
  | 'region'
  | 'establishment'
  | 'tuition2025'
  | 'tuition2026'
  | 'difference'
  | 'rate'
  | 'changeType';

const pageSize = 25;

export function SchoolsTable() {
  const { filteredRecords } = useDashboard();
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const sortKey = (params.get('sort') as SortKey | null) ?? 'tuition2026';
  const direction = params.get('dir') === 'asc' ? 'asc' : 'desc';

  const sorted = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      const result =
        typeof left === 'string' && typeof right === 'string'
          ? left.localeCompare(right, 'ko')
          : Number(left) - Number(right);
      return direction === 'asc' ? result : -result;
    });
  }, [filteredRecords, sortKey, direction]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pages);
  const visible = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setParams(next, { replace: true });
  };

  const changeSort = (key: SortKey) => {
    const nextDirection = sortKey === key && direction === 'desc' ? 'asc' : 'desc';
    updateParams({ sort: key, dir: nextDirection, page: '1' });
  };

  const classFor = (record: TuitionRecord) =>
    record.changeType === '상승' ? 'increase' : record.changeType === '하락' ? 'decrease' : 'freeze';

  return (
    <article className="card">
      <div className="table-toolbar">
        <p><strong>{filteredRecords.length}</strong>개 학교·캠퍼스 · 열 제목을 누르면 정렬됩니다.</p>
        <button className="button secondary" onClick={() => downloadRecordsCsv(sorted)}>
          현재 목록 CSV 저장
        </button>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <SortableHeader label="학교·캠퍼스" sortKey="school" onSort={changeSort} />
              <SortableHeader label="지역" sortKey="region" onSort={changeSort} />
              <SortableHeader label="설립" sortKey="establishment" onSort={changeSort} />
              <SortableHeader label="2025 등록금" sortKey="tuition2025" onSort={changeSort} />
              <SortableHeader label="2026 등록금" sortKey="tuition2026" onSort={changeSort} />
              <SortableHeader label="증감액" sortKey="difference" onSort={changeSort} />
              <SortableHeader label="증감률" sortKey="rate" onSort={changeSort} />
              <SortableHeader label="구분" sortKey="changeType" onSort={changeSort} />
            </tr>
          </thead>
          <tbody>
            {visible.map((record) => (
              <tr key={record.school}>
                <td>{record.school}</td>
                <td>{record.region}</td>
                <td>{record.establishment}</td>
                <td className="number">{formatWon(record.tuition2025)}</td>
                <td className="number">{formatWon(record.tuition2026)}</td>
                <td className={`number ${classFor(record)}`}>
                  {record.difference > 0 ? '+' : ''}{formatWon(record.difference)}
                </td>
                <td className={`number ${classFor(record)}`}>
                  {formatPercent(record.rate, true)}
                </td>
                <td className={classFor(record)}>{record.changeType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="button secondary"
          disabled={safePage <= 1}
          onClick={() => updateParams({ page: String(safePage - 1) })}
        >
          이전
        </button>
        <span>{safePage} / {pages}</span>
        <button
          className="button secondary"
          disabled={safePage >= pages}
          onClick={() => updateParams({ page: String(safePage + 1) })}
        >
          다음
        </button>
      </div>
    </article>
  );
}

function SortableHeader({
  label,
  sortKey,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  onSort: (key: SortKey) => void;
}) {
  return (
    <th scope="col">
      <button className="table-sort" onClick={() => onSort(sortKey)}>
        {label}
      </button>
    </th>
  );
}
