import { expect, type Page, test } from '@playwright/test';

const KAKAO_SEARCH = 'dapi.kakao.com/v3/search/book';

function searchInput(page: Page) {
  return page.getByRole('textbox', { name: '검색어' });
}

async function search(page: Page, query: string) {
  await searchInput(page).fill(query);
  await searchInput(page).press('Enter');
}

// 개발 모드 StrictMode가 첫 요청을 취소하고 다시 보내므로 끝난 요청만 센다.
function finishedPages(page: Page) {
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

test('불러오는 동안 스켈레톤을 보여주고, 결과가 오면 목록으로 바꾼다', async ({ page }) => {
  await page.goto('/');
  await search(page, '느린 검색');

  await expect(page.getByRole('status')).toHaveText('불러오는 중입니다.');
  await expect(page.getByText('검색된 결과가 없습니다.')).toHaveCount(0);

  await expect(page.getByRole('article')).toHaveCount(10, { timeout: 10_000 });
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('새 검색을 불러오는 동안 직전 건수를 그대로 보여준다', async ({ page }) => {
  await page.goto('/?query=무라카미 하루키');
  await expect(page.getByRole('article')).toHaveCount(10);

  await search(page, '느린 검색');

  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByText('총 866건')).toBeVisible();
});

test('스켈레톤 행은 책 행과 높이가 같다', async ({ page }) => {
  await page.goto('/?query=무라카미 하루키');
  const article = (await page.getByRole('article').first().boundingBox())!;

  await search(page, '느린 검색');
  const row = page.getByRole('status').locator('[aria-hidden="true"] > div').first();

  expect((await row.boundingBox())!.height).toBe(article.height);
});

test('검색이 실패하면 안내와 다시 시도 버튼을 보여주고, 누르면 다시 요청한다', async ({ page }) => {
  const pages = finishedPages(page);
  await page.goto('/');
  await search(page, '에러');

  await expect(page.getByRole('alert')).toHaveText('검색 결과를 불러오지 못했습니다.');
  await expect(page.getByText('총 0건')).toBeVisible();
  const requested = pages.length;

  await page.getByRole('button', { name: '다시 시도' }).click();

  await expect.poll(() => pages.length).toBeGreaterThan(requested);
  await expect(page.getByRole('alert')).toHaveText('검색 결과를 불러오지 못했습니다.');
});

test('다음 page가 실패하면 받은 목록은 두고 아래에서 다시 시도할 수 있다', async ({ page }) => {
  const pages = finishedPages(page);
  await page.goto('/?query=다음 페이지 에러');
  await expect(page.getByRole('article')).toHaveCount(10);

  await scrollToBottom(page);

  await expect(page.getByRole('alert')).toHaveText('다음 목록을 불러오지 못했습니다.');
  await expect(page.getByRole('article')).toHaveCount(10);
  const requested = pages.filter((value) => value === '2').length;

  await page.getByRole('button', { name: '다시 시도' }).click();

  await expect.poll(() => pages.filter((value) => value === '2').length).toBeGreaterThan(requested);
});
