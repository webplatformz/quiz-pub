import {expect, Page, test} from '@playwright/test';

export const saveQuizMock = (page: Page): Promise<void> => page.route('http://localhost:4173/api/quiz', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({"uuid":"SRAQDO","adminToken":"a4caffff-1198-49c5-8bcf-6f577586846f"})
  });
});

test('Use Case - create and save a quiz', async ({ page }) => {
  await saveQuizMock(page);
  await page.goto('/edit');

  await expect(page).toHaveTitle("Quiz Pub");

  // Fill in Quiz with 1 Round and 1 Question
  await page.getByPlaceholder('Quiz name').fill('Quiz Testname');
  const inputQuizName = page.locator('h3');
  await expect(inputQuizName).toContainText('Quiz Testname');

  await page.locator('#round-0').fill('r1');
  const inputRoundName = page.locator('#round-0');
  await expect(inputRoundName).toHaveValue('r1');

  await page.locator('#round-0-Q-0').fill('q11');
  const inputRound1Question1 = page.locator('#round-0-Q-0');
  await expect(inputRound1Question1).toHaveValue('q11');

  const responsePromise = page.waitForResponse(response => response.url().includes('/api/'));
  await page.locator('button[type=submit]').click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);

  //await page.goto('/edit/?code=SRAQDO');

  //await expect(inputQuizName).toContainText('SRAQDO');

});
