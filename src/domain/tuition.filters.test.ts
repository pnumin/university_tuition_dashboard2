import { describe, expect, it } from 'vitest';
import { filterTuitionRecords } from './tuition.filters';
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
    school: '연세대학교', region: '서울', establishment: '사립', status: '기존',
    tuition2025: 100, tuition2026: 110, difference: 10, rate: 10,
    changeType: '상승', majors,
  },
  {
    school: '서울시립대학교', region: '서울', establishment: '공립', status: '기존',
    tuition2025: 80, tuition2026: 80, difference: 0, rate: 0,
    changeType: '동결', majors,
  },
];

describe('filterTuitionRecords', () => {
  it('검색어와 설립구분을 동시에 적용한다', () => {
    const result = filterTuitionRecords(records, {
      query: '연세',
      region: '서울',
      establishment: '사립',
      changeType: '상승',
    });
    expect(result).toHaveLength(1);
    expect(result[0].school).toBe('연세대학교');
  });
});
