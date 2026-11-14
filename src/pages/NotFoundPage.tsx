import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="state-card">
      <h2>페이지를 찾을 수 없습니다.</h2>
      <Link className="button primary link-button" to="/">핵심 현황으로 이동</Link>
    </div>
  );
}
