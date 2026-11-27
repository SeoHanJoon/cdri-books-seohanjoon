import { expect, type Page, test } from '@playwright/test';

const KAKAO_SEARCH = 'dapi.kakao.com/v3/search/book';

function requestedPages(page: Page) {
  const pages: string[] = [];
  page.on('requestfinished', (request) => {
    if (request.url().includes(KAKAO_SEARCH)) {
      pages.push(new URL(request.url()).searchParams.get('page') ?? '');
    }
  });
  return pages;
}

async function scrollToBottom(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

test('목록 끝까지 내리면 다음 10권을 이어 붙인다', async ({ page }) => {
  await page.goto('/?query=무라카미 하루키');
  await expect(page.getByRole('article')).toHaveCount(10);

  await scrollToBottom(page);
  await expect(page.getByRole('article')).toHaveCount(20);
  await expect(page.getByRole('heading', { name: '여자 없는 남자들' })).toBeVisible();

  await scrollToBottom(page);
  await expect(page.getByRole('article')).toHaveCount(30);
});

test('마지막 page(is_end)를 받은 뒤에는 더 요청하지 않는다', async ({ page }) => {
  const pages = requestedPages(page);
  await page.goto('/?query=무라카미 하루키');

  for (const count of [10, 20, 30]) {
    await expect(page.getByRole('article')).toHaveCount(count);
    await scrollToBottom(page);
  }
  await page.waitForTimeout(1000);

  expect(pages).toEqual(['1', '2', '3']);
});

test('펼쳐 둔 행은 다음 page를 불러와도 그대로 펼쳐져 있다', async ({ page }) => {
  await page.goto('/?query=무라카미 하루키');
  const row = page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: '가호' }) });
  await row.getByRole('button', { name: '상세보기' }).click();

  await scrollToBottom(page);
  await expect(page.getByRole('article')).toHaveCount(20);

  await expect(row.getByRole('button', { name: '상세보기' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('목록 끝이 화면 밖이면 다음 page를 부르지 않는다', async ({ page }) => {
  const pages = requestedPages(page);
  await page.goto('/?query=무라카미 하루키');
  await expect(page.getByRole('article')).toHaveCount(10);
  await page.waitForTimeout(1000);

  expect(pages).toEqual(['1']);
});

test('불러온 목록이 화면보다 짧으면 스크롤하지 않아도 화면이 찰 때까지 이어서 부른다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 4000 });
  await page.goto('/?query=무라카미 하루키');

  await expect(page.getByRole('article')).toHaveCount(30);
});
