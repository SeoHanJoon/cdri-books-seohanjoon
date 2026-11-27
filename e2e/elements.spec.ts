import { expect, type Page, test } from '@playwright/test';

async function showBookRow(page: Page, title: string) {
  const row = page.getByRole('article').filter({ has: page.getByRole('heading', { name: title }) });
  await row.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  return row;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/dev/elements');
});

test('할인가가 있으면 원가에 취소선을 긋고 할인가를 함께 보여준다', async ({ page }) => {
  const row = await showBookRow(page, '고양이를 버리다');

  const original = row.getByRole('definition').filter({ hasText: '16,000원' });
  await expect(original).toBeVisible();
  await expect(original).toHaveCSS('text-decoration-line', 'line-through');
  await expect(row.getByRole('term').filter({ hasText: '할인가' })).toBeVisible();
  await expect(row.getByRole('definition').filter({ hasText: '13,500원' })).toBeVisible();
});

test('할인가가 없으면 원가만 취소선 없이 보여준다', async ({ page }) => {
  const row = await showBookRow(page, '노르웨이의 숲');
  await row.getByRole('button', { name: '상세보기' }).click();

  await expect(row.getByRole('term')).toHaveText(['원가']);
  const original = row.getByRole('definition');
  await expect(original).toHaveText('13,300원');
  await expect(original).not.toHaveCSS('text-decoration-line', 'line-through');
});

test('접힌 행은 할인가가 있으면 할인가를 보여준다', async ({ page }) => {
  const row = await showBookRow(page, '표지가 없는 책');
  await expect(row.getByText('8,100원')).toBeVisible();
  await expect(row.getByText('9,000원')).toHaveCount(0);
});

test('구매하기는 책 상세 페이지를 새 탭으로 연다', async ({ page }) => {
  const buy = (await showBookRow(page, '노르웨이의 숲')).getByRole('link', { name: '구매하기' });
  await expect(buy).toHaveAttribute('href', 'https://example.com/no-sale');
  await expect(buy).toHaveAttribute('target', '_blank');
});

test('상세보기를 누르면 행이 펼쳐지고, 다시 누르면 접힌다', async ({ page }) => {
  const row = await showBookRow(page, '노르웨이의 숲');
  const toggle = row.getByRole('button', { name: '상세보기' });

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(row.getByRole('heading', { name: '책 소개' })).toBeVisible();

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(row.getByRole('heading', { name: '책 소개' })).toHaveCount(0);
});

test('키보드로 펼치고 접어도 포커스가 상세보기 버튼에 남는다', async ({ page }) => {
  const row = await showBookRow(page, '노르웨이의 숲');
  const toggle = row.getByRole('button', { name: '상세보기' });

  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('펼친 뒤 Tab을 누르면 펼친 내용의 찜하기로 이동한다', async ({ page }) => {
  const row = await showBookRow(page, '노르웨이의 숲');

  await row.getByRole('button', { name: '상세보기' }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(row.getByRole('button', { name: '찜하기' })).toBeFocused();
});

test('접힌 행의 하트를 누르면 찜이 토글되고 행은 펼쳐지지 않는다', async ({ page }) => {
  const row = await showBookRow(page, '노르웨이의 숲');
  const heart = row.getByRole('button', { name: '찜하기' });

  await expect(heart).toHaveAttribute('aria-pressed', 'false');
  await heart.click();
  await expect(heart).toHaveAttribute('aria-pressed', 'true');
  await expect(row.getByRole('button', { name: '상세보기' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );

  await heart.click();
  await expect(heart).toHaveAttribute('aria-pressed', 'false');
});

test('펼친 행의 하트를 누르면 찜이 토글된다', async ({ page }) => {
  const heart = (await showBookRow(page, '고양이를 버리다')).getByRole('button', {
    name: '찜하기',
  });

  await expect(heart).toHaveAttribute('aria-pressed', 'true');
  await heart.click();
  await expect(heart).toHaveAttribute('aria-pressed', 'false');
});

test('한글 검색어를 입력하고 Enter를 누르면 한 번만 검색된다', async ({ page }) => {
  const input = page.getByRole('textbox', { name: '검색어' });
  await input.pressSequentially('무라카미 하루키');
  await input.press('Enter');

  await expect(page.getByTestId('search-log')).toContainText('검색 1회: 무라카미 하루키');
});

test('한글 조합 중에 Enter를 누르면 조합 중인 글자까지 한 번만 검색된다', async ({ page }) => {
  const input = page.getByRole('textbox', { name: '검색어' });
  await input.focus();

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.insertText', { text: '무라카미 하루' });
  await cdp.send('Input.imeSetComposition', { text: '키', selectionStart: 1, selectionEnd: 1 });
  await page.keyboard.press('Enter');

  await expect(page.getByTestId('search-log')).toContainText('검색 1회: 무라카미 하루키');
});

test('상세검색 버튼을 누르면 상세검색 이벤트가 전달된다', async ({ page }) => {
  await page
    .getByRole('region', { name: 'SearchBox' })
    .getByRole('button', { name: '상세검색' })
    .click();
  await expect(page.getByTestId('search-log')).toContainText('상세검색 1회');
});

test('좁은 화면에서도 버튼 글자는 줄바꿈되지 않는다', async ({ page }) => {
  for (const width of [375, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await showBookRow(page, '노르웨이의 숲');
    const heights = await page
      .getByRole('button', { name: '상세보기' })
      .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
    expect(
      heights.every((height) => height === 48),
      `${width}px`,
    ).toBe(true);
  }
});
