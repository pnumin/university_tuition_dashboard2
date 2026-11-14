import { expect, test } from '@playwright/test';

test('기본 데이터와 필터가 작동한다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /일반대학 등록금/ })).toBeVisible();
  await expect(page.getByText('206곳', { exact: true })).toBeVisible();

  await page.getByLabel('지역').selectOption('서울');
  await expect(page.getByText(/개 학교·캠퍼스가 검색되었습니다/)).toBeAttached();

  await page.getByRole('link', { name: '학교별 비교' }).click();
  await expect(page.getByRole('table')).toBeVisible();
});

test('빈 결과에서 초기화할 수 있다', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('학교명 검색').fill('존재하지않는학교명');
  await expect(page.getByText(/해당하는 학교·캠퍼스가 없습니다/)).toBeVisible();
  await page.getByRole('button', { name: '필터 초기화' }).click();
  await expect(page.getByText('206곳', { exact: true })).toBeVisible();
});
