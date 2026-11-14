import { useDashboard } from '../app/DashboardContext';
import { EmptyState } from '../components/common/Feedback';
import {
  AverageTuitionChart,
  ChangeDistributionChart,
  TopSchoolsChart,
  TuitionScatterChart,
} from '../components/charts/DashboardCharts';
import { KpiGrid } from '../components/kpi/KpiGrid';

export function OverviewPage() {
  const { filteredRecords, resetFilters } = useDashboard();

  if (!filteredRecords.length) return <EmptyState onReset={resetFilters} />;

  return (
    <>
      <KpiGrid />
      <section className="grid two">
        <AverageTuitionChart />
        <ChangeDistributionChart />
      </section>
      <section className="grid two">
        <TuitionScatterChart />
        <TopSchoolsChart />
      </section>
    </>
  );
}
