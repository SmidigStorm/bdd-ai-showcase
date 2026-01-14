const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');

const { Given, When, Then } = createBdd();

// Shared test state
let testId;
let createdOrganizations = new Map();
let createdEducations = new Map();

function uniqueName(name) {
  return `${name} ${testId}`;
}

// Export for use in other step files
module.exports = {
  getTestId: () => testId,
  setTestId: (id) => { testId = id; },
  uniqueName,
  createdOrganizations,
  createdEducations,
};

// Helper to create a test organization
async function createTestOrganization(request, name) {
  const uName = uniqueName(name);
  const response = await request.post('/api/organizations', {
    data: {
      name: uName,
      level: 'UNIVERSITY',
      category: 'LIBERAL_ARTS',
    },
  });
  const org = await response.json();
  createdOrganizations.set(name, { id: org.id, uniqueName: uName, ...org });
  return org;
}

// Background step - shared by all API tests
Given('I am logged in as an admin', async () => {
  testId = Date.now().toString();
  createdOrganizations.clear();
  createdEducations.clear();
});

// Homepage step - shared by all E2E tests
Given('I am on the homepage', async ({ page }) => {
  testId = Date.now().toString();
  createdOrganizations.clear();
  createdEducations.clear();
  await page.goto('/');
});

// Organization setup - used by both org and education tests
Given('an organization {string} exists', async ({ page, request }, name) => {
  if (!createdOrganizations.has(name)) {
    await createTestOrganization(request, name);
  }
  if (page) {
    await page.reload();
  }
});

// Shared save button
When('I click Save', async ({ page }) => {
  // Try organization save first, then education save
  const orgBtn = page.locator('#submit-org-btn');
  const eduBtn = page.locator('#submit-education-btn');

  if (await orgBtn.isVisible()) {
    await orgBtn.click();
  } else if (await eduBtn.isVisible()) {
    await eduBtn.click();
  }
});
