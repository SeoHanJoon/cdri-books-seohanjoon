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
