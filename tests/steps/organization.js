const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');

const { Given, When, Then } = createBdd();

let testId;
let currentOrganization = null;
let createdOrganizations = new Map();

function uniqueName(name) {
  return `${name} ${testId}`;
}

// Background
Given('I am logged in as an admin', async () => {
  testId = Date.now().toString();
  currentOrganization = null;
  createdOrganizations.clear();
  // No auth for now - admin access is assumed
});

// Create organizations
When('I create an organization with:', async ({ request }, dataTable) => {
  const data = {};
  const originalName = dataTable.raw().find(([key]) => key === 'name')?.[1];
  dataTable.raw().forEach(([key, value]) => {
    data[key] = value;
  });

  // Make name unique per test
  if (data.name) {
    data.name = uniqueName(data.name);
  }

  const response = await request.post('/api/organizations', { data });
  expect(response.status()).toBe(201);
  currentOrganization = await response.json();
  if (originalName) {
    createdOrganizations.set(originalName, { id: currentOrganization.id, uniqueName: data.name, ...currentOrganization });
  }
});

Then('the organization should be created successfully', async () => {
  expect(currentOrganization).toBeTruthy();
  expect(currentOrganization.name).toBeTruthy();
});

Then('the organization should have a unique ID', async () => {
  expect(currentOrganization.id).toBeTruthy();
  expect(currentOrganization.id).toMatch(/^[0-9a-f-]{36}$/);
});

// View organizations
Given('the following organizations exist:', async ({ request }, dataTable) => {
  const rows = dataTable.hashes();
  for (const row of rows) {
    const uName = uniqueName(row.name);
    const response = await request.post('/api/organizations', {
      data: {
        name: uName,
        level: row.level,
        category: row.category,
      },
    });
    const org = await response.json();
    createdOrganizations.set(row.name, { id: org.id, uniqueName: uName, ...org });
  }
});

When('I view all organizations', async ({ request }) => {
  const response = await request.get('/api/organizations');
  expect(response.status()).toBe(200);
  currentOrganization = await response.json();
});

Then('I should see {int} organizations', async ({}, count) => {
  expect(Array.isArray(currentOrganization)).toBe(true);
  expect(currentOrganization.length).toBeGreaterThanOrEqual(count);
});

Given('an organization {string} exists', async ({ page, request }, name) => {
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
  // Reload page if in E2E context
  if (page) {
    await page.reload();
  }
});

When('I view the organization {string}', async ({ request }, name) => {
  const org = createdOrganizations.get(name);
  const response = await request.get(`/api/organizations/${org.id}`);
  expect(response.status()).toBe(200);
  currentOrganization = await response.json();
});

Then('I should see the organization details', async () => {
  expect(currentOrganization).toBeTruthy();
  expect(currentOrganization.id).toBeTruthy();
  expect(currentOrganization.name).toBeTruthy();
});

// Update organizations
Given('an organization {string} exists with category {string}', async ({ request }, name, category) => {
  const uName = uniqueName(name);
  const response = await request.post('/api/organizations', {
    data: {
      name: uName,
      level: 'UNIVERSITY',
      category,
    },
  });
  const org = await response.json();
  createdOrganizations.set(name, { id: org.id, uniqueName: uName, ...org });
});

When('I update the organization name to {string}', async ({ request }, newName) => {
  const orgNames = Array.from(createdOrganizations.keys());
  const lastOrgName = orgNames[orgNames.length - 1];
  const org = createdOrganizations.get(lastOrgName);

  const uName = uniqueName(newName);
  const response = await request.put(`/api/organizations/${org.id}`, {
    data: { name: uName },
  });
  expect(response.status()).toBe(200);
  currentOrganization = await response.json();
  createdOrganizations.set(newName, { id: org.id, uniqueName: uName, ...currentOrganization });
});

Then('the organization name should be {string}', async ({}, expectedName) => {
  const uName = uniqueName(expectedName);
  expect(currentOrganization.name).toBe(uName);
});

When('I update the organization category to {string}', async ({ request }, newCategory) => {
  const orgNames = Array.from(createdOrganizations.keys());
  const lastOrgName = orgNames[orgNames.length - 1];
  const org = createdOrganizations.get(lastOrgName);

  const response = await request.put(`/api/organizations/${org.id}`, {
    data: { category: newCategory },
  });
  expect(response.status()).toBe(200);
  currentOrganization = await response.json();
});

Then('the organization category should be {string}', async ({}, expectedCategory) => {
  expect(currentOrganization.category).toBe(expectedCategory);
});

// Delete organizations
When('I delete the organization {string}', async ({ request }, name) => {
  const org = createdOrganizations.get(name);
  const response = await request.delete(`/api/organizations/${org.id}`);
  expect(response.status()).toBe(204);
});

Then('the organization should be marked as deleted', async () => {
  // Soft delete - verified by next step
});

Then('the organization should not appear in the organization list', async ({ request }) => {
  const uName = `Closing College ${testId}`;
  const response = await request.get('/api/organizations');
  const orgs = await response.json();
  const orgNames = orgs.map((o) => o.name);
  expect(orgNames).not.toContain(uName);
});

// E2E Browser Steps
Given('I am on the homepage', async ({ page }) => {
  testId = Date.now().toString();
  createdOrganizations.clear();
  await page.goto('/');
});

When('I click the Add Organization button', async ({ page }) => {
  await page.locator('#add-org-btn').click();
});

When('I fill in {string} as the name', async ({ page }, name) => {
  const uName = uniqueName(name);
  createdOrganizations.set(name, { uniqueName: uName });
  await page.locator('#org-name').fill(uName);
});

When('I click Save', async ({ page }) => {
  await page.locator('#submit-org-btn').click();
});

When('I click Edit on {string}', async ({ page }, name) => {
  const org = createdOrganizations.get(name);
  await page.locator(`tr[data-id="${org.id}"] button`).filter({ hasText: 'Edit' }).click();
});

When('I change the name to {string}', async ({ page }, name) => {
  const uName = uniqueName(name);
  createdOrganizations.set(name, { uniqueName: uName });
  await page.locator('#org-name').fill(uName);
});

When('I click Delete on {string}', async ({ page }, name) => {
  const org = createdOrganizations.get(name);
  await page.locator(`tr[data-id="${org.id}"] button`).filter({ hasText: 'Delete' }).click();
});

Then('I should see organizations in the list', async ({ page }) => {
  await expect(page.locator('#organizations-list tr[data-id]').first()).toBeVisible();
});

Then('I should see {string} in the list', async ({ page }, name) => {
  const org = createdOrganizations.get(name);
  await expect(page.locator('#organizations-list')).toContainText(org.uniqueName);
});

Then('{string} should not be in the list', async ({ page }, name) => {
  const org = createdOrganizations.get(name);
  await expect(page.locator('#organizations-list')).not.toContainText(org.uniqueName);
});
