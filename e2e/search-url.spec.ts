import { expect, type Page, test } from '@playwright/test';

const KAKAO_SEARCH = 'dapi.kakao.com/v3/search/book';

function searchInput(page: Page) {
  return page.getByRole('textbox', { name: '검색어' });
}

async function search(page: Page, query: string) {
  await searchInput(page).fill(query);
  await searchInput(page).press('Enter');
}

function countKakaoRequests(page: Page) {
  const urls: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes(KAKAO_SEARCH)) urls.push(request.url());
  });
  return urls;
}

test('검색하면 검색어가 URL에 담긴다', async ({ page }) => {
  await page.goto('/');
  await search(page, '  무라카미 하루키 ');

  await expect(page).toHaveURL(`/?${new URLSearchParams({ query: '무라카미 하루키' })}`);
});

test('URL의 검색어로 바로 들어오면 입력창과 결과를 채운다', async ({ page }) => {
  await page.goto('/?query=무라카미 하루키');

  await expect(searchInput(page)).toHaveValue('무라카미 하루키');
  await expect(page.getByText('총 866건')).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(10);
});

test('새로고침해도 검색 결과가 유지된다', async ({ page }) => {
  await page.goto('/');
  await search(page, '무라카미 하루키');
  await expect(page.getByRole('article')).toHaveCount(10);

  await page.reload();

  await expect(searchInput(page)).toHaveValue('무라카미 하루키');
  await expect(page.getByRole('article')).toHaveCount(10);
});

test('뒤로가기하면 이전 검색의 입력창과 결과로 돌아간다', async ({ page }) => {
  await page.goto('/');
  await search(page, '무라카미 하루키');
  await expect(page.getByRole('article')).toHaveCount(10);
  await search(page, '없는 책');
  await expect(page.getByText('검색된 결과가 없습니다.')).toBeVisible();

  await page.goBack();

  await expect(searchInput(page)).toHaveValue('무라카미 하루키');
  await expect(page.getByRole('article')).toHaveCount(10);

  await page.goBack();

  await expect(searchInput(page)).toHaveValue('');
  await expect(page.getByText('총 0건')).toBeVisible();
});

test('같은 검색을 다시 해도 방문 기록이 늘지 않는다', async ({ page }) => {
  await page.goto('/');
  await search(page, '무라카미 하루키');
  await expect(page.getByRole('article')).toHaveCount(10);
  const length = await page.evaluate(() => history.length);

  await search(page, '무라카미 하루키');

  expect(await page.evaluate(() => history.length)).toBe(length);
});

test('검색어를 지우고 검색하면 초기 화면으로 돌아간다', async ({ page }) => {
  await page.goto('/?query=무라카미 하루키');
  await expect(page.getByRole('article')).toHaveCount(10);

  await search(page, '   ');

  await expect(page).toHaveURL('/');
  await expect(page.getByText('검색된 결과가 없습니다.')).toBeVisible();
});

test('허용된 target이 있으면 메인 입력창은 비우고 상세 검색으로 요청한다', async ({ page }) => {
  const requests = countKakaoRequests(page);
  await page.goto('/?query=하루키&target=person');

  await expect(searchInput(page)).toHaveValue('');
  await expect.poll(() => requests.length).toBeGreaterThan(0);
  expect(new URL(requests[0]).searchParams.get('target')).toBe('person');
});

test('허용되지 않은 target이면 존재하지 않는 페이지를 보여주고 API를 부르지 않는다', async ({
  page,
}) => {
  const requests = countKakaoRequests(page);
  await page.goto('/?query=무라카미 하루키&target=foo');

  await expect(page.getByRole('heading', { name: '존재하지 않는 페이지입니다.' })).toBeVisible();
  await expect(page).toHaveURL(/target=foo/);
  expect(requests).toEqual([]);
});

test('검색 직후 URL이 바뀌기 전에 입력한 글자를 덮어쓰지 않는다', async ({ page }) => {
  await page.goto('/');
  await searchInput(page).fill('무라카미 하루키');

  await searchInput(page).evaluate((input: HTMLInputElement) => {
    input.form!.requestSubmit();
    Reflect.set(HTMLInputElement.prototype, 'value', '없는 책', input);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await expect(page).toHaveURL(`/?${new URLSearchParams({ query: '무라카미 하루키' })}`);
  await expect(searchInput(page)).toHaveValue('없는 책');
});
