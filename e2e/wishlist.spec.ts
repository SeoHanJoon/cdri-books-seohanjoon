import { expect, type Page, test } from '@playwright/test';

function bookRow(page: Page, title: string) {
  return page.getByRole('article').filter({ has: page.getByRole('heading', { name: title }) });
}

async function headerToTitleGap(page: Page, title: string) {
  const header = (await page.getByRole('banner').boundingBox())!;
  const heading = (await page.getByRole('heading', { name: title }).boundingBox())!;
  return heading.y - (header.y + header.height);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/wishlist');
});

test('찜한 책 건수와 목록을 보여준다', async ({ page }) => {
  await expect(page.getByRole('heading', { name: '내가 찜한 책' })).toBeVisible();
  await expect(page.getByText('찜한 책', { exact: true })).toBeVisible();
  await expect(page.getByText('총 10건')).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(10);
  await expect(page.getByText('찜한 책이 없습니다.')).toHaveCount(0);
});

test('목록의 책은 모두 찜한 상태로 보인다', async ({ page }) => {
  const hearts = page.getByRole('button', { name: '찜하기' });
  await expect(hearts).toHaveCount(10);
  for (const heart of await hearts.all()) {
    await expect(heart).toHaveAttribute('aria-pressed', 'true');
  }
});

test('여러 권을 동시에 펼칠 수 있다', async ({ page }) => {
  for (const title of ['가호', '1Q84 1']) {
    await bookRow(page, title).getByRole('button', { name: '상세보기' }).click();
  }
  await expect(page.getByRole('heading', { name: '책 소개' })).toHaveCount(2);
});

test('탭을 오가도 제목 위 여백이 도서 검색과 같다', async ({ page }) => {
  for (const width of [1920, 375]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/wishlist');
    const wishlistGap = await headerToTitleGap(page, '내가 찜한 책');
    await page.goto('/');
    const searchGap = await headerToTitleGap(page, '도서 검색');
    expect(wishlistGap, `${width}px`).toBe(searchGap);
  }
});
