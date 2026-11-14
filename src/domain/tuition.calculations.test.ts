import { describe, expect, it } from 'vitest';
import { calculateKpis } from './tuition.calculations';
import type { TuitionRecord } from './tuition.types';

const majors = {
  인문사회: { tuition2025: 1, tuition2026: 2 },
  자연과학: { tuition2025: 1, tuition2026: 2 },
  예체능: { tuition2025: 1, tuition2026: 2 },
  공학: { tuition2025: 1, tuition2026: 2 },
  의학: { tuition2025: 1, tuition2026: 2 },
};

const records: TuitionRecord[] = [
  {
    school: 'A', region: '서울', establishment: '사립', status: '기존',
    tuition2025: 100, tuition2026: 110, difference: 10, rate: 10,
    changeType: '상승', majors,
  },
  {
    school: 'B', region: '경기', establishment: '국립', status: '기존',
    tuition2025: 200, tuition2026: 200, difference: 0, rate: 0,
    changeType: '동결', majors,
  },
];

describe('calculateKpis', () => {
  it('평균과 상승 비율을 계산한다', () => {
    const result = calculateKpis(records);
    expect(result.schoolCount).toBe(2);
    expect(result.average2025).toBe(150);
    expect(result.average2026).toBe(155);
    expect(result.increaseCount).toBe(1);
    expect(result.increaseRatio).toBe(50);
  });
});
