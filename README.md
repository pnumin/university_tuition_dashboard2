# 일반대학 등록금 학생 부담 대시보드

2025년과 2026년 대학알리미 등록금 데이터를 비교하는 React + TypeScript 대시보드입니다.

## 주요 기능

- 학교명 검색
- 지역·설립구분·상승/동결/하락 필터
- 6개 핵심 KPI
- 평균 비교, 변동 분포, 산점도, 상위 학교 차트
- 지역 및 계열 분석
- 학교별 상세표, 정렬, 페이지 이동
- 필터 결과 CSV 다운로드
- URL 기반 필터·정렬 상태
- 반응형 UI와 오프라인 정적 배포

## 기술 스택

- React 19
- TypeScript
- Vite
- React Router
- react-plotly.js
- Vitest
- ESLint

## 실행 방법

Node.js의 현재 LTS 버전과 Python 3.10 이상을 권장합니다.

```bash
npm install
npm run validate:data
npm run dev
```

브라우저에서 Vite가 표시한 로컬 주소를 엽니다.

## 프로덕션 빌드

```bash
npm run build
npm run preview
```

빌드 결과는 `dist/` 폴더에 생성됩니다. `vite.config.ts`의 `base: './'` 설정으로 하위 경로 정적 배포도 지원합니다.

## 데이터 갱신

원본 Excel 파일:

- `data/raw/tuition_2025.xlsx`
- `data/raw/tuition_2026.xlsx`

Python 의존성 설치 후 데이터를 다시 생성합니다.

```bash
python -m pip install -r requirements-data.txt
npm run prepare:data
npm run validate:data
```

## 테스트

```bash
npm run typecheck
npm run lint
npm run test
```

## 데이터 분석 기준

- 학교종류가 `대학교`인 일반대학만 포함
- 본교·분교·캠퍼스를 각각 독립 분석
- 등록금 0원 및 결측 제외
- 학교명 기준으로 2025년과 2026년 연결
- 학교별 단순 평균이며 학생 수 가중평균이 아님
- 장학금 및 생활비를 반영하지 않은 명목 등록금

## 회귀 기준

- 비교 대상: 206곳
- 상승: 177곳
- 동결: 11곳
- 하락: 18곳

## 참고

현재 환경에서는 npm 패키지를 실제 설치하거나 브라우저 빌드를 수행하지 않았습니다. `npm install` 후 `npm run typecheck`, `npm run test`, `npm run build` 순서로 검증해 주세요.
