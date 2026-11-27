import { expect, test } from '@playwright/test';

test('첫 화면(/)에서 도서 검색 페이지가 보인다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '도서 검색' })).toBeVisible();
});

test('/wishlist에서 내가 찜한 책 페이지가 보인다', async ({ page }) => {
  await page.goto('/wishlist');
  await expect(page.getByRole('heading', { name: '내가 찜한 책' })).toBeVisible();
});

test('없는 경로로 들어오면 헤더와 존재하지 않는 페이지 안내가 보인다', async ({ page }) => {
  await page.goto('/abc');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { name: '존재하지 않는 페이지입니다.' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toHaveCount(0);
});

test('존재하지 않는 페이지에서 버튼을 누르면 새로고침 없이 도서 검색으로 간다', async ({
  page,
}) => {
  await page.goto('/abc');
  // 페이지를 새로 불러오면 window의 값이 사라지므로, 값이 남아 있으면 앱 안에서 이동한 것이다.
  await page.evaluate(() => Object.assign(window, { __spaMarker: true }));

  await page.getByRole('link', { name: '도서 검색으로 돌아가기' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: '도서 검색' })).toBeVisible();
  expect(await page.evaluate(() => '__spaMarker' in window)).toBe(true);
});
