interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function LoadingState() {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <h2>등록금 데이터를 불러오고 있습니다.</h2>
    </div>
  );
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-card error" role="alert">
      <h2>데이터를 불러오지 못했습니다.</h2>
      <p>{message}</p>
      <button className="button primary" onClick={onRetry}>
        다시 시도
      </button>
    </div>
  );
}

export function EmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="state-card">
      <h2>선택한 조건에 해당하는 학교·캠퍼스가 없습니다.</h2>
      <p>필터를 변경하거나 초기화해 주세요.</p>
      {onReset && (
        <button className="button primary" onClick={onReset}>
          필터 초기화
        </button>
      )}
    </div>
  );
}
