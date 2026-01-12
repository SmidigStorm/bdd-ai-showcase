const { createBdd } = require('playwright-bdd');

const { Given, Then } = createBdd();

Given('I am on the homepage', async ({ page }) => {
  await page.goto('/');
});

Then('I should see {string}', async ({ page }, text) => {
  await page.getByText(text).waitFor();
});
