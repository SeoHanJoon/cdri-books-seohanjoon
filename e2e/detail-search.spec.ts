import { expect, type Page, test } from '@playwright/test';

function trigger(page: Page) {
  return page.getByRole('button', { name: '상세검색' });
}

async function openPopup(page: Page) {
  await trigger(page).click();
  const dialog = page.getByRole('dialog', { name: '상세 검색' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe('도서 검색 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('상세검색을 누르면 버튼 바로 아래 가운데에 팝업이 열리고 검색 조건에 포커스가 간다', async ({
    page,
  }) => {
    const dialog = await openPopup(page);

    const button = (await trigger(page).boundingBox())!;
    const popup = (await dialog.boundingBox())!;
    expect(popup.y - (button.y + button.height)).toBe(15);
    expect(Math.abs(popup.x + popup.width / 2 - (button.x + button.width / 2))).toBeLessThan(1);
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('combobox', { name: '검색 조건' })).toBeFocused();
  });

  test('바깥을 누르면 닫힌다', async ({ page }) => {
    const dialog = await openPopup(page);
    await page.getByRole('heading', { name: '도서 검색' }).click();
    await expect(dialog).toHaveCount(0);
  });

  test('바깥 입력창을 누르면 닫히고 포커스는 그 입력창으로 간다', async ({ page }) => {
    const dialog = await openPopup(page);
    const input = page.getByRole('textbox', { name: '검색어', exact: true });
    await input.click();
    await expect(dialog).toHaveCount(0);
    await expect(input).toBeFocused();
  });

  test('Esc를 누르면 닫히고 포커스가 상세검색 버튼으로 돌아온다', async ({ page }) => {
    const dialog = await openPopup(page);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
  });

  test('X를 누르면 닫히고 포커스가 상세검색 버튼으로 돌아온다', async ({ page }) => {
    const dialog = await openPopup(page);
    await dialog.getByRole('button', { name: '상세 검색 닫기' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
  });

  test('상세검색 버튼을 다시 누르면 닫힌다', async ({ page }) => {
    const dialog = await openPopup(page);
    await trigger(page).click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
  });

  test('Tab으로 팝업 밖으로 나가면 닫힌다', async ({ page }) => {
    const dialog = await openPopup(page);
    // 검색 조건 → 검색어 → 검색하기 → 닫기 → 팝업 밖
    for (let i = 0; i < 3; i += 1) await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: '상세 검색 닫기' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog).toHaveCount(0);
  });

  test('팝업 뒤에 포커스 받을 요소가 없어도 Tab으로 나가면 닫힌다', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Tanstack query devtools' }).waitFor();
    await page.evaluate(() => document.querySelector('.tsqd-parent-container')?.remove());
    const dialog = await openPopup(page);
    for (let i = 0; i < 3; i += 1) await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: '상세 검색 닫기' })).toBeFocused();

    await page.keyboard.press('Tab');

    await expect(dialog).toHaveCount(0);
  });

  test('검색 결과가 있으면 Tab으로 나갈 때 포커스가 다음 요소로 간다', async ({ page }) => {
    await page.goto('/?query=무라카미 하루키');
    await expect(page.getByRole('article')).toHaveCount(10);
    const dialog = await openPopup(page);
    for (let i = 0; i < 3; i += 1) await page.keyboard.press('Tab');

    await page.keyboard.press('Tab');

    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('button', { name: '상세보기' }).first()).toBeFocused();
  });

  test('검색 조건을 마우스로 고르면 고른 항목은 목록에서 빠진다', async ({ page }) => {
    const dialog = await openPopup(page);
    const select = dialog.getByRole('combobox', { name: '검색 조건' });

    await expect(select).toHaveText('제목');
    await select.click();
    await expect(dialog.getByRole('option')).toHaveText(['저자명', '출판사']);

    await dialog.getByRole('option', { name: '저자명' }).click();
    await expect(select).toHaveText('저자명');
    await expect(dialog.getByRole('listbox')).toHaveCount(0);

    await select.click();
    await expect(dialog.getByRole('option')).toHaveText(['제목', '출판사']);
  });

  test('검색 조건을 키보드로 고를 수 있다', async ({ page }) => {
    const dialog = await openPopup(page);
    const select = dialog.getByRole('combobox', { name: '검색 조건' });

    await page.keyboard.press('ArrowDown');
    await expect(select).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(select).toHaveText('출판사');
    await expect(select).toHaveAttribute('aria-expanded', 'false');
    await expect(select).toBeFocused();
  });

  test('목록이 열려 있을 때 Esc는 목록만 닫고, 한 번 더 누르면 팝업이 닫힌다', async ({ page }) => {
    const dialog = await openPopup(page);
    const select = dialog.getByRole('combobox', { name: '검색 조건' });

    await page.keyboard.press('ArrowDown');
    await expect(dialog.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog.getByRole('listbox')).toHaveCount(0);
    await expect(dialog).toBeVisible();
    await expect(select).toHaveText('제목');

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('검색어를 넣고 검색하기를 누르면 팝업이 닫히고 포커스가 상세검색 버튼으로 돌아온다', async ({
    page,
  }) => {
    const dialog = await openPopup(page);
    await dialog.getByRole('textbox', { name: '상세 검색어' }).fill('하루키');
    await dialog.getByRole('button', { name: '검색하기' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
  });

  test('검색어가 비어 있으면 검색하기를 눌러도 팝업이 열린 채 검색어 입력창으로 포커스가 간다', async ({
    page,
  }) => {
    const dialog = await openPopup(page);
    await dialog.getByRole('textbox', { name: '상세 검색어' }).fill('   ');
    await dialog.getByRole('button', { name: '검색하기' }).click();

    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('textbox', { name: '상세 검색어' })).toBeFocused();
    await expect(page).toHaveURL('/');
  });

  test('검색어가 비어 막히면 입력창이 잘못됨과 안내를 알리고, 글자를 치면 푼다', async ({
    page,
  }) => {
    const dialog = await openPopup(page);
    const input = dialog.getByRole('textbox', { name: '상세 검색어' });
    await expect(input).toHaveAttribute('aria-invalid', 'false');

    await dialog.getByRole('button', { name: '검색하기' }).click();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('검색어를 입력해 주세요.');

    await input.pressSequentially('하');
    await expect(input).toHaveAttribute('aria-invalid', 'false');
    await expect(input).toHaveAccessibleDescription('');
  });

  test('좁은 화면에서는 팝업이 화면 안에 들어오도록 버튼 오른쪽 끝에 맞춘다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    const dialog = await openPopup(page);

    const button = (await trigger(page).boundingBox())!;
    const popup = (await dialog.boundingBox())!;
    expect(popup.x).toBeGreaterThanOrEqual(16);
    expect(popup.x + popup.width).toBe(button.x + button.width);
  });
});

test.describe('상세 검색 실행', () => {
  const KEYWORD = '무라카미 하루키';
  const PERSON_URL = `/?${new URLSearchParams({ query: KEYWORD, target: 'person' })}`;

  function mainInput(page: Page) {
    return page.getByRole('textbox', { name: '검색어', exact: true });
  }

  async function mainSearch(page: Page, query: string) {
    await mainInput(page).fill(query);
    await mainInput(page).press('Enter');
  }

  async function detailSearch(page: Page, targetLabel: string, keyword: string) {
    const dialog = await openPopup(page);
    const select = dialog.getByRole('combobox', { name: '검색 조건' });
    if ((await select.textContent()) !== targetLabel) {
      await select.click();
      await dialog.getByRole('option', { name: targetLabel }).click();
    }
    await dialog.getByRole('textbox', { name: '상세 검색어' }).fill(keyword);
    await dialog.getByRole('button', { name: '검색하기' }).click();
    await expect(dialog).toHaveCount(0);
  }

  async function expectPopupDefault(page: Page, targetLabel: string, keyword: string) {
    const dialog = await openPopup(page);
    await expect(dialog.getByRole('combobox', { name: '검색 조건' })).toHaveText(targetLabel);
    await expect(dialog.getByRole('textbox', { name: '상세 검색어' })).toHaveValue(keyword);
    await page.keyboard.press('Escape');
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('상세 검색하면 조건이 URL과 요청에 담기고, 전체 검색어를 비우고 결과를 보여준다', async ({
    page,
  }) => {
    await mainSearch(page, KEYWORD);
    await expect(page.getByText('총 866건')).toBeVisible();

    const request = page.waitForRequest((req) => req.url().includes('dapi.kakao.com'));
    await detailSearch(page, '저자명', KEYWORD);

    expect(new URL((await request).url()).searchParams.get('target')).toBe('person');
    await expect(page).toHaveURL(PERSON_URL);
    await expect(mainInput(page)).toHaveValue('');
    await expect(page.getByText('총 780건')).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(10);
  });

  test('팝업을 다시 열면 실행 중인 상세 조건으로 시작한다', async ({ page }) => {
    await detailSearch(page, '저자명', `  ${KEYWORD} `);

    await expectPopupDefault(page, '저자명', KEYWORD);
  });

  test('상세 검색 뒤 전체 검색하면 상세 조건이 초기화된다', async ({ page }) => {
    await detailSearch(page, '저자명', KEYWORD);
    await expect(page.getByText('총 780건')).toBeVisible();

    await mainSearch(page, KEYWORD);

    await expect(page).toHaveURL(`/?${new URLSearchParams({ query: KEYWORD })}`);
    await expect(page.getByText('총 866건')).toBeVisible();
    await expectPopupDefault(page, '제목', '');
  });

  test('같은 조건으로 다시 상세 검색해도 쓰다 만 전체 검색어를 비운다', async ({ page }) => {
    await detailSearch(page, '저자명', KEYWORD);
    await mainInput(page).fill('노르웨이 숲');

    await detailSearch(page, '저자명', KEYWORD);

    await expect(mainInput(page)).toHaveValue('');
  });

  test('상세 검색끼리 뒤로가기하면 이전 조건과 결과로 돌아가고, 쓰다 만 전체 검색어를 비운다', async ({
    page,
  }) => {
    await detailSearch(page, '저자명', KEYWORD);
    await expect(page.getByText('총 780건')).toBeVisible();
    await detailSearch(page, '출판사', '민음사');
    await expect(page.getByText('검색된 결과가 없습니다.')).toBeVisible();
    await mainInput(page).fill('노르웨이 숲');

    await page.goBack();

    await expect(page).toHaveURL(PERSON_URL);
    await expect(page.getByText('총 780건')).toBeVisible();
    await expect(mainInput(page)).toHaveValue('');
    await expectPopupDefault(page, '저자명', KEYWORD);
  });

  test('전체 검색 뒤 상세 검색에서 뒤로가기하면 전체 검색어와 결과로 돌아간다', async ({
    page,
  }) => {
    await mainSearch(page, KEYWORD);
    await expect(page.getByText('총 866건')).toBeVisible();
    await detailSearch(page, '저자명', KEYWORD);
    await expect(page.getByText('총 780건')).toBeVisible();

    await page.goBack();

    await expect(page).toHaveURL(`/?${new URLSearchParams({ query: KEYWORD })}`);
    await expect(mainInput(page)).toHaveValue(KEYWORD);
    await expect(page.getByText('총 866건')).toBeVisible();
    await expectPopupDefault(page, '제목', '');
  });

  test('상세 검색어 입력창에서 Enter를 누르면 검색한다', async ({ page }) => {
    const dialog = await openPopup(page);
    const input = dialog.getByRole('textbox', { name: '상세 검색어' });
    await input.fill('민음사');
    await input.press('Enter');

    await expect(dialog).toHaveCount(0);
    await expect(page).toHaveURL(`/?${new URLSearchParams({ query: '민음사', target: 'title' })}`);
  });

  test('상세 검색어 앞뒤 공백은 지우고 검색한다', async ({ page }) => {
    const request = page.waitForRequest((req) => req.url().includes('dapi.kakao.com'));
    await detailSearch(page, '저자명', `  ${KEYWORD} `);

    expect(new URL((await request).url()).searchParams.get('query')).toBe(KEYWORD);
    await expect(page).toHaveURL(PERSON_URL);
    await expect(page.getByText('총 780건')).toBeVisible();
  });

  test('검색하지 않고 닫으면 쓰던 내용은 버리고, 다시 열면 실행 중인 조건으로 시작한다', async ({
    page,
  }) => {
    await detailSearch(page, '출판사', '민음사');

    const dialog = await openPopup(page);
    await dialog.getByRole('textbox', { name: '상세 검색어' }).fill('문학동네');
    await page.keyboard.press('Escape');

    await expectPopupDefault(page, '출판사', '민음사');
  });

  test('상세 검색은 검색 기록에 남지 않는다', async ({ page }) => {
    await mainSearch(page, '노르웨이 숲');
    await detailSearch(page, '저자명', KEYWORD);

    await mainInput(page).click();
    await expect(page.getByRole('list', { name: '검색 기록' }).getByRole('listitem')).toHaveText([
      '노르웨이 숲',
    ]);
  });
});
