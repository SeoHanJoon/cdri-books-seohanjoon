import { expect, test } from '@playwright/test';

test('현재 페이지의 탭만 활성으로 표시된다', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: '주요 메뉴' });

  await page.goto('/');
  await expect(nav.getByRole('link', { name: '도서 검색' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(nav.getByRole('link', { name: '내가 찜한 책' })).not.toHaveAttribute('aria-current');

  await page.goto('/wishlist');
  await expect(nav.getByRole('link', { name: '내가 찜한 책' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(nav.getByRole('link', { name: '도서 검색' })).not.toHaveAttribute('aria-current');
});

test('탭을 누르면 해당 페이지로 이동한다', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: '주요 메뉴' });

  await page.goto('/');
  await nav.getByRole('link', { name: '내가 찜한 책' }).click();
  await expect(page).toHaveURL('/wishlist');
  await expect(page.getByRole('heading', { name: '내가 찜한 책' })).toBeVisible();

  await nav.getByRole('link', { name: '도서 검색' }).click();
  await expect(page).toHaveURL('/');
});

test('로고를 누르면 도서 검색으로 이동한다', async ({ page }) => {
  await page.goto('/wishlist');
  await page.getByRole('link', { name: 'CERTICOS BOOKS' }).click();
  await expect(page).toHaveURL('/');
});

test('좁은 화면에서도 로고와 탭이 겹치지 않는다', async ({ page }) => {
  for (const width of [375, 768, 1024]) {
    await page.setViewportSize({ width, height: 600 });
    await page.goto('/');
    const logo = await page.getByRole('link', { name: 'CERTICOS BOOKS' }).boundingBox();
    const firstTab = await page.getByRole('navigation').getByRole('link').first().boundingBox();
    const overlaps = logo!.x + logo!.width > firstTab!.x && logo!.y + logo!.height > firstTab!.y;
    expect(overlaps, `${width}px`).toBe(false);
  }
});
