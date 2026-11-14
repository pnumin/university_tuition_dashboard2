import { useDashboard } from '../../app/DashboardContext';
import { formatManwon, formatPercent, formatSignedManwon } from '../../domain/tuition.formatters';

interface KpiCardProps {
  label: string;
  value: string;
  description: string;
}

function KpiCard({ label, value, description }: KpiCardProps) {
  return (
    <article className="kpi-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </article>
  );
}

export function KpiGrid() {
  const { kpis } = useDashboard();

  return (
    <section className="kpi-grid" aria-label="핵심 지표">
      <KpiCard label="비교 학교·캠퍼스" value={`${kpis.schoolCount}곳`} description="필터 적용 후" />
      <KpiCard label="2025 평균 등록금" value={formatManwon(kpis.average2025)} description="학교별 단순 평균" />
      <KpiCard label="2026 평균 등록금" value={formatManwon(kpis.average2026)} description="학교별 단순 평균" />
      <KpiCard label="평균 증가액" value={formatSignedManwon(kpis.averageDifference)} description="2026년 − 2025년" />
      <KpiCard label="평균 수준 증감률" value={formatPercent(kpis.averageLevelRate, true)} description="두 연도 평균 비교" />
      <KpiCard label="등록금 상승 비율" value={formatPercent(kpis.increaseRatio)} description={`${kpis.increaseCount}곳 상승`} />
    </section>
  );
}
