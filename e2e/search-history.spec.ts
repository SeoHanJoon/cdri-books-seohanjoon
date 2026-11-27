import { expect, type Page, test } from '@playwright/test';

function searchInput(page: Page) {
  return page.getByRole('textbox', { name: '검색어' });
}

function historyList(page: Page) {
  return page.getByRole('list', { name: '검색 기록' });
}

async function search(page: Page, query: string) {
  await searchInput(page).fill(query);
  await searchInput(page).press('Enter');
}

async function openHistory(page: Page) {
  await searchInput(page).click();
  await expect(historyList(page)).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('검색하면 기록에 남고, 최근 검색어부터 보여준다', async ({ page }) => {
  await search(page, '노르웨이 숲');
  await search(page, '무라카미 하루키');

  await openHistory(page);
  await expect(historyList(page).getByRole('listitem')).toHaveText([
    '무라카미 하루키',
    '노르웨이 숲',
  ]);
});

test('같은 검색어로 다시 검색하면 하나만 남기고 맨 앞으로 옮긴다', async ({ page }) => {
  await search(page, '노르웨이 숲');
  await search(page, '무라카미 하루키');
  await search(page, '  노르웨이 숲  ');

  await openHistory(page);
  await expect(historyList(page).getByRole('listitem')).toHaveText([
    '노르웨이 숲',
    '무라카미 하루키',
  ]);
});

test('뒤로가기는 기록에 넣지 않고, 돌아간 검색을 다시 실행하면 맨 앞으로 옮긴다', async ({
  page,
}) => {
  await search(page, '노르웨이 숲');
  await expect(page.getByText('총 0건')).toBeVisible();
  await search(page, '무라카미 하루키');
  await expect(page.getByText('총 866건')).toBeVisible();
  await page.goBack();
  await expect(searchInput(page)).toHaveValue('노르웨이 숲');

  await openHistory(page);
  await expect(historyList(page).getByRole('listitem')).toHaveText([
    '무라카미 하루키',
    '노르웨이 숲',
  ]);

  await searchInput(page).press('Enter');
  await openHistory(page);
  await expect(historyList(page).getByRole('listitem')).toHaveText([
    '노르웨이 숲',
    '무라카미 하루키',
  ]);
});

test('9번째 검색을 하면 가장 오래된 검색어를 지운다', async ({ page }) => {
  for (let i = 1; i <= 9; i++) await search(page, `검색어 ${i}`);

  await openHistory(page);
  const items = historyList(page).getByRole('listitem');
  await expect(items).toHaveCount(8);
  await expect(items.first()).toHaveText('검색어 9');
  await expect(items.last()).toHaveText('검색어 2');
});

test('X를 누르면 그 검색어만 지운다', async ({ page }) => {
  await search(page, '노르웨이 숲');
  await search(page, '무라카미 하루키');

  await openHistory(page);
  await page.getByRole('button', { name: '노르웨이 숲 검색 기록 삭제' }).click();

  await expect(historyList(page).getByRole('listitem')).toHaveText(['무라카미 하루키']);
});

test('기록을 누르면 그 검색어로 다시 검색하고 맨 앞으로 옮긴다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  await search(page, '없는 책');
  await expect(page.getByText('총 0건')).toBeVisible();

  await openHistory(page);
  await historyList(page).getByRole('button', { name: '무라카미 하루키', exact: true }).click();

  await expect(historyList(page)).toHaveCount(0);
  await expect(searchInput(page)).toHaveValue('무라카미 하루키');
  await expect(page).toHaveURL(/query=%EB%AC%B4%EB%9D%BC%EC%B9%B4%EB%AF%B8/);
  await expect(page.getByText('총 866건')).toBeVisible();

  await openHistory(page);
  await expect(historyList(page).getByRole('listitem')).toHaveText(['무라카미 하루키', '없는 책']);
});

test('새로고침해도 기록이 남아 있다', async ({ page }) => {
  await search(page, '노르웨이 숲');
  await search(page, '무라카미 하루키');

  await page.reload();

  await openHistory(page);
  await expect(historyList(page).getByRole('listitem')).toHaveText([
    '무라카미 하루키',
    '노르웨이 숲',
  ]);
});

test('주소로 바로 들어온 검색은 기록에 넣지 않는다', async ({ page }) => {
  await page.goto('/?query=무라카미 하루키');
  await expect(page.getByText('총 866건')).toBeVisible();

  await searchInput(page).click();
  await expect(historyList(page)).toHaveCount(0);
});

test('다른 탭에서 검색한 기록도 이어서 쌓인다', async ({ page, context }) => {
  const otherTab = await context.newPage();
  await otherTab.goto('/');

  await search(page, '노르웨이 숲');
  await search(otherTab, '무라카미 하루키');
  await page.bringToFront();
  await openHistory(page);
  await expect(historyList(page).getByRole('listitem')).toHaveText([
    '무라카미 하루키',
    '노르웨이 숲',
  ]);

  await search(page, '없는 책');

  await openHistory(page);
  await expect(historyList(page).getByRole('listitem')).toHaveText([
    '없는 책',
    '무라카미 하루키',
    '노르웨이 숲',
  ]);
});
