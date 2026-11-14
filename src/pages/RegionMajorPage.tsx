import { useDashboard } from '../app/DashboardContext';
import { EmptyState } from '../components/common/Feedback';
import {
  MajorComparisonChart,
  RegionAverageChart,
  RegionDifferenceChart,
} from '../components/charts/DashboardCharts';

export function RegionMajorPage() {
  const { filteredRecords, resetFilters } = useDashboard();

  if (!filteredRecords.length) return <EmptyState onReset={resetFilters} />;

  return (
    <>
      <section className="grid two">
        <RegionAverageChart />
        <RegionDifferenceChart />
      </section>
      <MajorComparisonChart />
    </>
  );
}
