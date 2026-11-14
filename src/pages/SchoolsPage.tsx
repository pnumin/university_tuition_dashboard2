import { useDashboard } from '../app/DashboardContext';
import { EmptyState } from '../components/common/Feedback';
import { SchoolsTable } from '../components/table/SchoolsTable';

export function SchoolsPage() {
  const { filteredRecords, resetFilters } = useDashboard();
  if (!filteredRecords.length) return <EmptyState onReset={resetFilters} />;
  return <SchoolsTable />;
}
