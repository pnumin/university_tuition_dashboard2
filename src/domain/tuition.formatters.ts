export function formatWon(value: number): string {
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}

export function formatManwon(value: number): string {
  return `${(value / 10_000).toLocaleString('ko-KR', {
    maximumFractionDigits: 1,
  })}만원`;
}

export function formatSignedManwon(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatManwon(value)}`;
}

export function formatPercent(value: number, signed = false): string {
  const sign = signed && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
