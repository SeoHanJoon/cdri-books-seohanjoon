import { expect, type Page, test } from '@playwright/test';

function bookRow(page: Page, title: string) {
  return page.getByRole('article').filter({ has: page.getByRole('heading', { name: title }) });
}

function bookTitles(page: Page) {
  return page.getByRole('article').getByRole('heading', { level: 2 });
}

function likeButton(page: Page, title: string) {
  return bookRow(page, title).getByRole('button', { name: '찜하기' });
}

function goToTab(page: Page, name: '도서 검색' | '내가 찜한 책') {
  return page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name }).click();
}

async function searchMurakami(page: Page) {
  const input = page.getByRole('textbox', { name: '검색어' });
  await input.fill('무라카미 하루키');
  await input.press('Enter');
  await expect(page.getByRole('article')).toHaveCount(10);
}

async function likeFirstBooks(page: Page, count: number) {
  const rows = page.getByRole('article');
  for (let i = 0; i < count; i++) {
    if (i === (await rows.count())) {
      await rows.last().scrollIntoViewIfNeeded();
      await expect(rows).toHaveCount(i + 10);
    }
    await rows.nth(i).getByRole('button', { name: '찜하기' }).click();
  }
}

async function headerToTitleGap(page: Page, title: string) {
  const header = (await page.getByRole('banner').boundingBox())!;
  const heading = (await page.getByRole('heading', { name: title }).boundingBox())!;
  return heading.y - (header.y + header.height);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('찜한 책이 없으면 0건과 빈 상태 안내를 보여준다', async ({ page }) => {
  await goToTab(page, '내가 찜한 책');

  await expect(page.getByRole('heading', { name: '내가 찜한 책' })).toBeVisible();
  await expect(page.getByText('찜한 책', { exact: true })).toBeVisible();
  await expect(page.getByText('총 0건')).toBeVisible();
  await expect(page.getByText('찜한 책이 없습니다.')).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(0);
});

test('검색 결과에서 찜한 책을 최근 찜한 순서로 보여주고, 새로고침해도 남아 있다', async ({
  page,
}) => {
  await searchMurakami(page);
  await likeButton(page, '가호').click();
  await likeButton(page, '직업으로서의 소설가').click();

  await goToTab(page, '내가 찜한 책');
  await expect(page.getByText('총 2건')).toBeVisible();
  await expect(bookTitles(page)).toHaveText(['직업으로서의 소설가', '가호']);
  await expect(likeButton(page, '가호')).toHaveAttribute('aria-pressed', 'true');

  await page.reload();
  await expect(page.getByText('총 2건')).toBeVisible();
  await expect(bookTitles(page)).toHaveText(['직업으로서의 소설가', '가호']);
});

test('찜을 풀면 건수만 줄고 행은 남아서 다시 찜할 수 있고, 탭을 옮겼다 오면 사라진다', async ({
  page,
}) => {
  await searchMurakami(page);
  await likeButton(page, '가호').click();
  await likeButton(page, '직업으로서의 소설가').click();
  await goToTab(page, '내가 찜한 책');

  await likeButton(page, '가호').click();
  await expect(page.getByText('총 1건')).toBeVisible();
  await expect(bookTitles(page)).toHaveText(['직업으로서의 소설가', '가호']);
  await expect(likeButton(page, '가호')).toHaveAttribute('aria-pressed', 'false');
  await expect(likeButton(page, '가호')).toBeFocused();

  await likeButton(page, '가호').click();
  await expect(page.getByText('총 2건')).toBeVisible();
  await expect(likeButton(page, '가호')).toHaveAttribute('aria-pressed', 'true');

  await likeButton(page, '가호').click();
  await goToTab(page, '도서 검색');
  await goToTab(page, '내가 찜한 책');
  await expect(page.getByText('총 1건')).toBeVisible();
  await expect(bookTitles(page)).toHaveText(['직업으로서의 소설가']);
});

test('모두 찜을 풀어도 페이지에 있는 동안은 빈 상태로 바뀌지 않는다', async ({ page }) => {
  await searchMurakami(page);
  await likeButton(page, '가호').click();
  await goToTab(page, '내가 찜한 책');

  await likeButton(page, '가호').click();
  await expect(page.getByText('총 0건')).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByText('찜한 책이 없습니다.')).toHaveCount(0);
});

test('찜한 책을 10권씩 보여주고, 목록 끝까지 내리면 다음 10권을 보여준다', async ({ page }) => {
  await searchMurakami(page);
  await likeFirstBooks(page, 12);
  await goToTab(page, '내가 찜한 책');

  await expect(page.getByText('총 12건')).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(10);

  await page.getByRole('article').last().scrollIntoViewIfNeeded();
  await expect(page.getByRole('article')).toHaveCount(12);
});

test('여러 권을 동시에 펼칠 수 있다', async ({ page }) => {
  await searchMurakami(page);
  await likeButton(page, '가호').click();
  await likeButton(page, '직업으로서의 소설가').click();
  await goToTab(page, '내가 찜한 책');

  for (const title of ['가호', '직업으로서의 소설가']) {
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

test('찜할 때 할인가가 없던 책은 원가만 취소선 없이 보여준다', async ({ page }) => {
  const noSaleBook = {
    isbn: '9788937434488',
    title: '노르웨이의 숲',
    authors: ['무라카미 하루키'],
    thumbnail: '',
    price: 13300,
    salePrice: null,
    url: 'https://example.com/no-sale',
    contents: '',
  };
  await page.evaluate((book) => {
    localStorage.setItem(
      'cdri-books/wishlist',
      JSON.stringify({ state: { books: [book] }, version: 1 }),
    );
  }, noSaleBook);
  await page.goto('/wishlist');

  const row = bookRow(page, '노르웨이의 숲');
  await expect(row.getByText('13,300원')).toBeVisible();

  await row.getByRole('button', { name: '상세보기' }).click();
  await expect(row.getByRole('term')).toHaveText(['원가']);
  const original = row.getByRole('definition');
  await expect(original).toHaveText('13,300원');
  await expect(original).not.toHaveCSS('text-decoration-line', 'line-through');
});
