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
  await expect(searchInput(page)).toBeFocused();

  await page.getByRole('button', { name: '무라카미 하루키 검색 기록 삭제' }).click();
  await expect(historyList(page)).toHaveCount(0);
});

test('기록을 누르면 그 검색어로 다시 검색하고 맨 앞으로 옮긴다', async ({ page }) => {
  await search(page, '무라카미 하루키');
  await search(page, '없는 책');
  await expect(page.getByText('총 0건')).toBeVisible();

  await openHistory(page);
  await historyList(page).getByRole('button', { name: '무라카미 하루키', exact: true }).click();

  await expect(historyList(page)).toHaveCount(0);
  await expect(searchInput(page)).toHaveValue('무라카미 하루키');
  await expect(searchInput(page)).toBeFocused();
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

test.describe('드롭다운', () => {
  test.beforeEach(async ({ page }) => {
    await search(page, '무라카미 하루키');
    await search(page, '노르웨이 숲');
  });

  test('입력창을 누르면 열리고 Esc를 누르면 닫힌다', async ({ page }) => {
    await expect(historyList(page)).toHaveCount(0);
    await searchInput(page).click();
    await expect(historyList(page).getByRole('listitem')).toHaveText([
      '노르웨이 숲',
      '무라카미 하루키',
    ]);

    await page.keyboard.press('Escape');
    await expect(historyList(page)).toHaveCount(0);
    await expect(searchInput(page)).toBeFocused();

    await searchInput(page).click();
    await expect(historyList(page)).toBeVisible();
  });

  test('바깥을 누르거나 Tab으로 빠져나가면 닫힌다', async ({ page }) => {
    await openHistory(page);
    await page.getByRole('heading', { name: '도서 검색' }).click();
    await expect(historyList(page)).toHaveCount(0);

    await openHistory(page);
    for (let i = 0; i < 4; i += 1) {
      await page.keyboard.press('Tab');
      await expect(historyList(page)).toBeVisible();
    }
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: '상세검색' })).toBeFocused();
    await expect(historyList(page)).toHaveCount(0);
  });

  test('안쪽 빈 곳을 눌러도 닫히지 않고 입력창 포커스가 남는다', async ({ page }) => {
    await openHistory(page);
    const listBox = (await historyList(page).boundingBox())!;
    const centerX = listBox.x + listBox.width / 2;

    // 기록 줄 위(7px)·아래(16px) 여백, 입력 줄의 돋보기 아이콘
    await page.mouse.click(centerX, listBox.y + 3);
    await page.mouse.click(centerX, listBox.y + listBox.height - 6);
    await page.getByRole('search').locator('svg').first().click();

    await expect(historyList(page)).toBeVisible();
    await expect(searchInput(page)).toBeFocused();
  });

  test('Enter로 검색하면 닫힌다', async ({ page }) => {
    await openHistory(page);
    await searchInput(page).fill('고양이');
    await expect(historyList(page)).toBeVisible();
    await searchInput(page).press('Enter');
    await expect(historyList(page)).toHaveCount(0);
  });

  test('X는 아이콘 크기만 누를 수 있고, 줄의 나머지는 어디를 눌러도 검색어를 고른다', async ({
    page,
  }) => {
    await openHistory(page);
    const row = historyList(page).getByRole('listitem').last();
    const remove = page.getByRole('button', { name: '무라카미 하루키 검색 기록 삭제' });

    const removeBox = (await remove.boundingBox())!;
    expect([removeBox.width, removeBox.height]).toEqual([24, 24]);

    // 줄 오른쪽 끝에서 2px 안쪽 — X 아이콘 바깥이다.
    const rowBox = (await row.boundingBox())!;
    await page.mouse.click(rowBox.x + rowBox.width - 2, rowBox.y + rowBox.height / 2);
    await expect(searchInput(page)).toHaveValue('무라카미 하루키');
    await expect(page.getByText('총 866건')).toBeVisible();
  });

  test('기록 줄에 마우스를 올리거나 키보드로 포커스하면 배경이 진해진다', async ({ page }) => {
    await openHistory(page);
    const rows = historyList(page).getByRole('listitem');
    const TRANSPARENT = 'rgba(0, 0, 0, 0)';
    const GRAY = 'rgb(218, 218, 218)';

    await expect(rows.nth(0)).toHaveCSS('background-color', TRANSPARENT);
    await rows.nth(0).hover();
    await expect(rows.nth(0)).toHaveCSS('background-color', GRAY);
    await expect(rows.nth(1)).toHaveCSS('background-color', TRANSPARENT);

    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(rows.nth(1)).toHaveCSS('background-color', GRAY);
  });
});
