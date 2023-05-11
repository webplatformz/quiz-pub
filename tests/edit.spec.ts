import { test, expect } from '@playwright/test';

test('homepage has empty Title with placeholder characters', async ({ page }) => {
  await page.goto('/edit');

  await expect(page).toHaveTitle("Quiz Pub");

  //Fill in Quiz with one Round and 1 Question
  await page.getByPlaceholder('Quiz name').fill('Quiz Testname');

  const inputQuizName = page.locator("h3");
  await expect(inputQuizName).toContainText("Quiz Testname");

});
