import { expect, type Page, test } from '@playwright/test';

async function search(page: Page, query: string) {
  const input = page.getByRole('textbox', { name: '검색어' });
  await input.fill(query);
  await input.press('Enter');
}

function bookRow(page: Page, title: string) {
  return page.getByRole('article').filter({ has: page.getByRole('heading', { name: title }) });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('처음에는 0건과 결과 없음 안내를 보여준다', async ({ page }) => {
  await expect(page.getByText('도서 검색 결과')).toBeVisible();
  await expect(page.getByText('총 0건')).toBeVisible();
  await expect(page.getByText('검색된 결과가 없습니다.')).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(0);
});

test('검색어를 입력하고 Enter를 누르면 건수와 결과 10개를 보여준다', async ({ page }) => {
  await search(page, '무라카미 하루키');

  await expect(page.getByText('총 866건')).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(10);
  await expect(page.getByText('검색된 결과가 없습니다.')).toHaveCount(0);
});

test('결과가 없는 검색어는 0건과 결과 없음 안내를 보여준다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  await search(page, '없는 책');

  await expect(page.getByText('총 0건')).toBeVisible();
  await expect(page.getByText('검색된 결과가 없습니다.')).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(0);
});

test('여러 권을 동시에 펼칠 수 있다', async ({ page }) => {
  await search(page, '무라카미 하루키');

  for (const title of ['가호', '1Q84 1']) {
    await bookRow(page, title).getByRole('button', { name: '상세보기' }).click();
  }

  await expect(page.getByRole('heading', { name: '책 소개' })).toHaveCount(2);
  for (const title of ['가호', '1Q84 1']) {
    await expect(bookRow(page, title).getByRole('button', { name: '상세보기' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  }
});

test('새로 검색하면 펼쳐 둔 행이 접힌다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  await bookRow(page, '가호').getByRole('button', { name: '상세보기' }).click();
  await expect(page.getByRole('heading', { name: '책 소개' })).toHaveCount(1);

  await search(page, '없는 책');
  await search(page, '무라카미 하루키');
  await expect(page.getByRole('heading', { name: '책 소개' })).toHaveCount(0);
});

test('구매하기는 책 상세 페이지를 새 탭으로 연다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  const buy = bookRow(page, '가호').getByRole('link', { name: '구매하기' });

  await expect(buy).toHaveAttribute('href', /search\.daum\.net.*bookId=7316273/);
  await expect(buy).toHaveAttribute('target', '_blank');
});

test('검색 기록이 없으면 입력창에 포커스해도 드롭다운이 열리지 않는다', async ({ page }) => {
  await page.getByRole('textbox', { name: '검색어' }).click();
  await expect(page.getByRole('list', { name: '검색 기록' })).toHaveCount(0);
});

test('잘린 책 소개는 끝에 말줄임표를 붙인다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  const row = bookRow(page, '1Q84 1');
  await row.getByRole('button', { name: '상세보기' }).click();

  await expect(row.getByText(/다른 세계…$/)).toBeVisible();
});

test('제목 위 여백은 넓은 화면 104px, 좁은 화면 40px이다', async ({ page }) => {
  for (const [width, gap] of [
    [1920, 104],
    [375, 40],
  ]) {
    await page.setViewportSize({ width, height: 800 });
    const header = (await page.getByRole('banner').boundingBox())!;
    const title = (await page.getByRole('heading', { name: '도서 검색' }).boundingBox())!;
    expect(title.y - (header.y + header.height), `${width}px`).toBe(gap);
  }
});

test('누를 수 있는 버튼은 손가락 모양 커서를 보여준다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  await page.getByRole('button', { name: '상세검색' }).click();

  const targets = [
    page.getByRole('button', { name: '상세보기' }).first(),
    page.getByRole('button', { name: '찜하기' }).first(),
    page.getByRole('link', { name: '구매하기' }).first(),
    page.getByRole('combobox', { name: '검색 조건' }),
    page.getByRole('button', { name: '검색하기' }),
    page.getByRole('button', { name: '상세 검색 닫기' }),
  ];
  for (const target of targets) {
    await expect(target).toHaveCSS('cursor', 'pointer');
  }
});

test('펼친 행은 원가에 취소선을 긋고 할인가를 함께 보여준다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  const row = bookRow(page, '가호');
  await row.getByRole('button', { name: '상세보기' }).click();

  await expect(row.getByRole('term')).toHaveText(['원가', '할인가']);
  const original = row.getByRole('definition').filter({ hasText: '18,500원' });
  await expect(original).toHaveCSS('text-decoration-line', 'line-through');
  await expect(row.getByRole('definition').filter({ hasText: '16,650원' })).toBeVisible();
});

test('접힌 행은 할인가만 보여준다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  const row = bookRow(page, '가호');

  await expect(row.getByText('16,650원')).toBeVisible();
  await expect(row.getByText('18,500원')).toHaveCount(0);
});

test('상세보기를 누르면 행이 펼쳐지고, 다시 누르면 접힌다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  const row = bookRow(page, '가호');
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
  await search(page, '무라카미 하루키');
  const toggle = bookRow(page, '가호').getByRole('button', { name: '상세보기' });

  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('펼친 뒤 Tab을 누르면 펼친 내용의 찜하기로 이동한다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  const row = bookRow(page, '가호');

  await row.getByRole('button', { name: '상세보기' }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(row.getByRole('button', { name: '찜하기' })).toBeFocused();
});

test('좁은 화면에서도 버튼 글자는 줄바꿈되지 않는다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  for (const width of [375, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const heights = await page
      .getByRole('button', { name: '상세보기' })
      .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
    expect(
      heights.every((height) => height === 48),
      `${width}px`,
    ).toBe(true);
  }
});

test.describe('한글 입력', () => {
  function countSearchRequests(page: Page) {
    const queries: string[] = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.hostname === 'dapi.kakao.com') queries.push(url.searchParams.get('query') ?? '');
    });
    return queries;
  }

  test('한글 검색어를 입력하고 Enter를 누르면 한 번만 검색한다', async ({ page }) => {
    const queries = countSearchRequests(page);
    const input = page.getByRole('textbox', { name: '검색어' });
    await input.pressSequentially('무라카미 하루키');
    await input.press('Enter');

    await expect(page.getByRole('article')).toHaveCount(10);
    expect(queries).toEqual(['무라카미 하루키']);
  });

  test('한글 조합 중에 Enter를 누르면 조합 중인 글자까지 한 번만 검색한다', async ({ page }) => {
    const queries = countSearchRequests(page);
    const input = page.getByRole('textbox', { name: '검색어' });
    await input.focus();

    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.insertText', { text: '무라카미 하루' });
    await cdp.send('Input.imeSetComposition', { text: '키', selectionStart: 1, selectionEnd: 1 });
    await page.keyboard.press('Enter');

    await expect(page.getByRole('article')).toHaveCount(10);
    expect(queries).toEqual(['무라카미 하루키']);
  });
});

test('표지는 화면에 가까워질 때 불러온다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  const covers = page.getByRole('article').locator('img');

  await expect(covers).toHaveCount(10);
  for (const cover of await covers.all()) {
    await expect(cover).toHaveAttribute('loading', 'lazy');
  }
});
