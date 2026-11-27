import { expect, test } from '@playwright/test'

test('제목이 Noto Sans KR 폰트 파일로 그려진다', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '도서 검색' })).toBeVisible()

  const loaded = await page.evaluate(async () => {
    await document.fonts.ready
    // 공백은 아직 받지 않은 조각에도 포함되어 있어 check가 false를 돌려준다.
    return document.fonts.check('700 22px "Noto Sans KR Variable"', '도서검색')
  })
  expect(loaded).toBe(true)
})
