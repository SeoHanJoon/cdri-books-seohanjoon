import { expect, type Page, test } from '@playwright/test';

async function search(page: Page, query: string) {
  const input = page.getByRole('textbox', { name: '검색어' });
  await input.fill(query);
  await input.press('Enter');
}

function bookRow(page: Page, title: string) {
  return page.getByRole('article').filter({ has: page.getByRole('heading', { name: title }) });
}

function likeButton(page: Page, title: string) {
  return bookRow(page, title).getByRole('button', { name: '찜하기' });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await search(page, '무라카미 하루키');
  await expect(page.getByRole('article')).toHaveCount(10);
});

test('하트를 누르면 찜하고, 다시 누르면 찜을 푼다', async ({ page }) => {
  await expect(likeButton(page, '가호')).toHaveAttribute('aria-pressed', 'false');

  await likeButton(page, '가호').click();
  await expect(likeButton(page, '가호')).toHaveAttribute('aria-pressed', 'true');
  await expect(likeButton(page, '직업으로서의 소설가')).toHaveAttribute('aria-pressed', 'false');

  await likeButton(page, '가호').click();
  await expect(likeButton(page, '가호')).toHaveAttribute('aria-pressed', 'false');
});

test('하트를 눌러도 행이 펼쳐지지 않는다', async ({ page }) => {
  await likeButton(page, '가호').click();

  await expect(bookRow(page, '가호').getByRole('button', { name: '상세보기' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('펼친 행의 큰 하트와 접힌 행의 작은 하트가 같은 찜 상태를 보여준다', async ({ page }) => {
  const detailButton = bookRow(page, '가호').getByRole('button', { name: '상세보기' });
  await likeButton(page, '가호').click();

  await detailButton.click();
  await expect(likeButton(page, '가호')).toHaveAttribute('aria-pressed', 'true');
  await likeButton(page, '가호').click();

  await detailButton.click();
  await expect(likeButton(page, '가호')).toHaveAttribute('aria-pressed', 'false');
});

test('새로고침하거나 다른 검색 뒤 돌아와도 찜이 남아 있다', async ({ page }) => {
  await likeButton(page, '가호').click();

  await page.reload();
  await expect(likeButton(page, '가호')).toHaveAttribute('aria-pressed', 'true');

  await search(page, '없는 책');
  await expect(page.getByText('총 0건')).toBeVisible();
  await search(page, '무라카미 하루키');
  await expect(likeButton(page, '가호')).toHaveAttribute('aria-pressed', 'true');
});
