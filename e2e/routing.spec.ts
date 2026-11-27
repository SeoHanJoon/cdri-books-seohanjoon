import { expect, test } from '@playwright/test';

test('첫 화면(/)에서 도서 검색 페이지가 보인다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '도서 검색' })).toBeVisible();
});

test('/wishlist에서 내가 찜한 책 페이지가 보인다', async ({ page }) => {
  await page.goto('/wishlist');
  await expect(page.getByRole('heading', { name: '내가 찜한 책' })).toBeVisible();
});

test('없는 경로로 들어오면 존재하지 않는 페이지 안내가 보인다', async ({ page }) => {
  await page.goto('/abc');
  await expect(page.getByText('존재하지 않는 페이지입니다.')).toBeVisible();
});
