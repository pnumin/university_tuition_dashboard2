import type { TuitionRecord } from '../domain/tuition.types';

export function downloadRecordsCsv(records: TuitionRecord[]): void {
  const header = [
    '학교·캠퍼스',
    '지역',
    '설립구분',
    '2025 등록금',
    '2026 등록금',
    '증감액',
    '증감률',
    '변동',
  ];

  const rows = records.map((record) => [
    record.school,
    record.region,
    record.establishment,
    record.tuition2025,
    record.tuition2026,
    record.difference,
    record.rate,
    record.changeType,
  ]);

  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
  const csv = `\uFEFF${[header, ...rows].map((row) => row.map(escape).join(',')).join('\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'filtered_tuition_comparison.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}
