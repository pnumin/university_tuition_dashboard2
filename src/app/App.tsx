import { NavLink, Route, Routes } from 'react-router';
import { DashboardFilters } from '../components/filters/DashboardFilters';
import { ErrorState, LoadingState } from '../components/common/Feedback';
import { useDashboard } from './DashboardContext';
import { OverviewPage } from '../pages/OverviewPage';
import { RegionMajorPage } from '../pages/RegionMajorPage';
import { SchoolsPage } from '../pages/SchoolsPage';
import { MethodologyPage } from '../pages/MethodologyPage';
import { NotFoundPage } from '../pages/NotFoundPage';

const navigation = [
  { to: '/', label: '핵심 현황', end: true },
  { to: '/region-major', label: '지역·계열' },
  { to: '/schools', label: '학교별 비교' },
  { to: '/methodology', label: '분석 기준' },
];

export function App() {
  const { loading, error, retry, metadata } = useDashboard();

  return (
    <>
      <header className="app-header">
        <div className="container">
          <h1>2025–2026 일반대학 등록금 학생 부담 대시보드</h1>
          <p>
            학생·학부모용 · 일반대학만 분석 · 본교/분교/캠퍼스 독립 · 등록금 0원 제외
          </p>
        </div>
      </header>

      <main className="container main-content">
        <div className="notice" role="note">
          <strong>해석 유의사항</strong> — 학교별 명목 평균 등록금입니다. 국가·교내장학금,
          기숙사비와 생활비 및 학생 수 가중치는 반영하지 않습니다.
        </div>

        <DashboardFilters />

        <nav className="tabs" aria-label="대시보드 화면">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : (
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/region-major" element={<RegionMajorPage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </main>

      <footer className="app-footer">
        {metadata?.source ?? '대학알리미 등록금 현황'} · 데이터 버전{' '}
        {metadata?.dataVersion ?? '-'}
      </footer>
    </>
  );
}
