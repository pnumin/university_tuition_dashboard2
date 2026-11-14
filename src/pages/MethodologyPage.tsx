import { useDashboard } from '../app/DashboardContext';

export function MethodologyPage() {
  const { metadata } = useDashboard();

  return (
    <article className="card methodology">
      <h2>분석 기준과 데이터 범위</h2>
      <ul>
        <li>학교종류가 ‘대학교’인 일반대학만 포함합니다.</li>
        <li>본교·분교·제2캠퍼스 등을 각각 독립된 분석 단위로 사용합니다.</li>
        <li>등록금이 0원이거나 결측인 학교·캠퍼스를 제외합니다.</li>
        <li>연도 비교는 2025년과 2026년의 학교명이 일치하는 경우에 수행합니다.</li>
        <li>평균은 학생 수 가중평균이 아닌 학교·캠퍼스 단순 평균입니다.</li>
        <li>계열 비교는 해당 계열의 두 연도 값이 모두 0원보다 큰 경우만 포함합니다.</li>
      </ul>

      <h3>학생·학부모가 추가로 확인할 사항</h3>
      <ol>
        <li>지원 학과의 계열별·학년별 실제 등록금</li>
        <li>국가장학금 및 교내장학금 적용 후 실제 납부액</li>
        <li>장학금의 성적 및 학점 유지 조건</li>
        <li>기숙사비, 식비, 교통비 등 지역별 생활비</li>
        <li>본교와 캠퍼스 간 장학제도 및 교육과정 차이</li>
        <li>등록금 분할납부와 학자금대출 지원 여부</li>
      </ol>

      <h3>데이터 정보</h3>
      <dl className="metadata-list">
        <div><dt>출처</dt><dd>{metadata?.source}</dd></div>
        <div><dt>데이터 버전</dt><dd>{metadata?.dataVersion}</dd></div>
        <div><dt>생성일</dt><dd>{metadata?.generatedAt}</dd></div>
        <div><dt>비교 대상</dt><dd>{metadata?.comparisonCount}개 학교·캠퍼스</dd></div>
      </dl>
    </article>
  );
}
