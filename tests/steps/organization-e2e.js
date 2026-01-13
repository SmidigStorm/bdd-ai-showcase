const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');

const { Given, When, Then } = createBdd();

// Test-isolated state
let testId;
let orgName;
let updatedName;
let createdOrgId;

Given('I am on the homepage', async ({ page }) => {
  testId = Date.now().toString();
  orgName = null;
  updatedName = null;
  createdOrgId = null;
  await page.goto('/');
});

Given('I create a test organization via API', async ({ request }) => {
  orgName = `Test Org ${testId}`;
  const response = await request.post('/api/organizations', {
    data: { name: orgName, level: 'UNIVERSITY', category: 'LIBERAL_ARTS' }
  });
  const org = await response.json();
  createdOrgId = org.id;
});

Given('I refresh the page', async ({ page }) => {
  await page.reload();
});

When('I click the Add Organization button', async ({ page }) => {
  await page.locator('#add-org-btn').click();
});

When('I fill in a unique name', async ({ page }) => {
  orgName = `Test Org ${testId}`;
  await page.locator('#org-name').fill(orgName);
});

When('I click Save', async ({ page }) => {
  await page.locator('#submit-org-btn').click();
});

When('I click Edit on my organization', async ({ page }) => {
  await page.locator(`tr[data-id="${createdOrgId}"] button`).filter({ hasText: 'Edit' }).click();
});

When('I change the name to something unique', async ({ page }) => {
  updatedName = `Updated Org ${testId}`;
  await page.locator('#org-name').fill(updatedName);
});

When('I click Delete on my organization', async ({ page }) => {
  await page.locator(`tr[data-id="${createdOrgId}"] button`).filter({ hasText: 'Delete' }).click();
});

Then('I should see organizations in the list', async ({ page }) => {
  await expect(page.locator('#organizations-list tr[data-id]').first()).toBeVisible();
});

Then('I should see my organization in the list', async ({ page }) => {
  await expect(page.locator('#organizations-list')).toContainText(orgName);
});

Then('I should see the updated name in the list', async ({ page }) => {
  await expect(page.locator('#organizations-list')).toContainText(updatedName);
});

Then('my organization should not be in the list', async ({ page }) => {
  await expect(page.locator(`tr[data-id="${createdOrgId}"]`)).toHaveCount(0);
});
