import { test, expect } from '@playwright/test';

test('homepage has empty Title with placeholder characters', async ({ page }) => {
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

  // await page.getByRole('button', { name: /submit/i }).click();
  await page.locator('button[type=submit]').click();
  const response = await page
      .waitForResponse(response => response.url().includes('/quiz-pub.pages.dev/') && response.status() === 200);
  console.log('RESPONSE ' + (await response.body()));
  // Listen for all console events and handle errors
  page.on('console', msg => {
    if (msg.type() === 'error')
      console.log(`Error text: "${msg.text()}"`);
    // the console.error:
    // PUT http://localhost:5173/api/quiz 404 (Not Found)
  });
});
