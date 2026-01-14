const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const common = require('./common');

const { Given, When, Then } = createBdd();

let currentAdmission = null;

function uniqueName(name) {
  return common.uniqueName(name);
}

// Helper to ensure organization exists
async function ensureOrganization(request) {
  if (common.createdOrganizations.size === 0) {
    const uName = uniqueName('Test University');
    const response = await request.post('/api/organizations', {
      data: { name: uName, level: 'UNIVERSITY', category: 'LIBERAL_ARTS' },
    });
    const org = await response.json();
    common.createdOrganizations.set('Test University', { id: org.id, uniqueName: uName, ...org });
  }
  return Array.from(common.createdOrganizations.values())[0];
}

// Create admissions
When('I create an admission with:', async ({ request }, dataTable) => {
  const data = {};
  const originalName = dataTable.raw().find(([key]) => key === 'name')?.[1];
  dataTable.raw().forEach(([key, value]) => {
    data[key] = value;
  });

  if (data.name) {
    data.name = uniqueName(data.name);
  }

  // Resolve organization reference if given by name
  if (data.organization) {
    const org = common.createdOrganizations.get(data.organization);
    if (org) {
      data.organizationId = org.id;
    }
    delete data.organization;
  }

  // Ensure we have an organization
  if (!data.organizationId) {
    const org = await ensureOrganization(request);
    data.organizationId = org.id;
  }

  const response = await request.post('/api/admissions', { data });
  expect(response.status()).toBe(201);
  currentAdmission = await response.json();
  if (originalName) {
    common.createdAdmissions.set(originalName, { id: currentAdmission.id, uniqueName: data.name, ...currentAdmission });
  }
});

Then('the admission should be created successfully', async () => {
  expect(currentAdmission).toBeTruthy();
  expect(currentAdmission.name).toBeTruthy();
});

Then('the admission should have a unique ID', async () => {
  expect(currentAdmission.id).toBeTruthy();
  expect(currentAdmission.id).toMatch(/^[0-9a-f-]{36}$/);
});

Then('the admission status should be {string}', async ({}, status) => {
  expect(currentAdmission.status).toBe(status);
});

// View admissions
Given('the following admissions exist:', async ({ request }, dataTable) => {
  const rows = dataTable.hashes();
  const org = await ensureOrganization(request);

  for (const row of rows) {
    const uName = uniqueName(row.name);

    let organizationId = row.organizationId || org.id;
    if (row.organization) {
      const orgRef = common.createdOrganizations.get(row.organization);
      if (orgRef) {
        organizationId = orgRef.id;
      }
    }

    const response = await request.post('/api/admissions', {
      data: {
        name: uName,
        applicationOpens: row.applicationOpens,
        applicationDeadline: row.applicationDeadline,
        organizationId,
      },
    });
    const adm = await response.json();
    common.createdAdmissions.set(row.name, { id: adm.id, uniqueName: uName, ...adm });
  }
});

When('I view all admissions', async ({ request }) => {
  const response = await request.get('/api/admissions');
  expect(response.status()).toBe(200);
  currentAdmission = await response.json();
});

Then('I should see {int} admissions', async ({}, count) => {
  expect(Array.isArray(currentAdmission)).toBe(true);
  expect(currentAdmission.length).toBeGreaterThanOrEqual(count);
});

Given('an admission {string} exists', async ({ page, request }, name) => {
  const org = await ensureOrganization(request);

  const uName = uniqueName(name);
  const response = await request.post('/api/admissions', {
    data: {
      name: uName,
      applicationOpens: '2025-01-15T00:00:00Z',
      applicationDeadline: '2025-04-15T23:59:59Z',
      organizationId: org.id,
    },
  });
  const adm = await response.json();
  common.createdAdmissions.set(name, { id: adm.id, uniqueName: uName, ...adm });
  if (page) {
    await page.reload();
  }
});

When('I view the admission {string}', async ({ request }, name) => {
  const adm = common.createdAdmissions.get(name);
  const response = await request.get(`/api/admissions/${adm.id}`);
  expect(response.status()).toBe(200);
  currentAdmission = await response.json();
});

Then('I should see the admission details', async () => {
  expect(currentAdmission).toBeTruthy();
  expect(currentAdmission.id).toBeTruthy();
  expect(currentAdmission.name).toBeTruthy();
});

// Update admissions
Given('an admission {string} exists with deadline {string}', async ({ request }, name, deadline) => {
  const org = await ensureOrganization(request);

  const uName = uniqueName(name);
  const response = await request.post('/api/admissions', {
    data: {
      name: uName,
      applicationOpens: '2025-01-15T00:00:00Z',
      applicationDeadline: deadline,
      organizationId: org.id,
    },
  });
  const adm = await response.json();
  common.createdAdmissions.set(name, { id: adm.id, uniqueName: uName, ...adm });
});

When('I update the admission name to {string}', async ({ request }, newName) => {
  const admNames = Array.from(common.createdAdmissions.keys());
  const lastAdmName = admNames[admNames.length - 1];
  const adm = common.createdAdmissions.get(lastAdmName);

  const uName = uniqueName(newName);
  const response = await request.put(`/api/admissions/${adm.id}`, {
    data: { name: uName },
  });
  expect(response.status()).toBe(200);
  currentAdmission = await response.json();
  common.createdAdmissions.set(newName, { id: adm.id, uniqueName: uName, ...currentAdmission });
});

Then('the admission name should be {string}', async ({}, expectedName) => {
  const uName = uniqueName(expectedName);
  expect(currentAdmission.name).toBe(uName);
});

When('I update the admission deadline to {string}', async ({ request }, newDeadline) => {
  const admNames = Array.from(common.createdAdmissions.keys());
  const lastAdmName = admNames[admNames.length - 1];
  const adm = common.createdAdmissions.get(lastAdmName);

  const response = await request.put(`/api/admissions/${adm.id}`, {
    data: { applicationDeadline: newDeadline },
  });
  expect(response.status()).toBe(200);
  currentAdmission = await response.json();
});

Then('the admission deadline should be {string}', async ({}, expectedDeadline) => {
  expect(currentAdmission.applicationDeadline).toBe(expectedDeadline);
});

// Delete admissions
When('I delete the admission {string}', async ({ request }, name) => {
  const adm = common.createdAdmissions.get(name);
  const response = await request.delete(`/api/admissions/${adm.id}`);
  expect(response.status()).toBe(204);
});

Then('the admission should be deleted', async () => {
  // Soft delete - verified by next step
});

Then('the admission should not appear in the admission list', async ({ request }) => {
  const response = await request.get('/api/admissions');
  const adms = await response.json();
  const admNames = Array.from(common.createdAdmissions.values()).map(a => a.uniqueName);
  const apiNames = adms.map((a) => a.name);

  for (const name of admNames) {
    if (name.includes('Cancelled')) {
      expect(apiNames).not.toContain(name);
    }
  }
});

// E2E Browser Steps
Then('I should see admissions in the list', async ({ page }) => {
  await page.locator('.tab[data-tab="admissions"]').click();
  await expect(page.locator('#admissions-list tr[data-id]').first()).toBeVisible();
});

When('I click the Add Admission button', async ({ page }) => {
  await page.locator('.tab[data-tab="admissions"]').click();
  await page.locator('#add-admission-btn').click();
});

When('I fill in {string} as the application opens date', async ({ page }, date) => {
  await page.locator('#admission-opens').fill(date);
});

When('I fill in {string} as the application deadline', async ({ page }, date) => {
  await page.locator('#admission-deadline').fill(date);
});

When('I select admission organization {string}', async ({ page }, name) => {
  const org = common.createdOrganizations.get(name);
  await page.locator('#admission-organization').selectOption(org.id);
});

Then('I should see {string} in the admissions list', async ({ page }, name) => {
  const adm = common.createdAdmissions.get(name);
  if (adm && adm.uniqueName) {
    await expect(page.locator('#admissions-list')).toContainText(adm.uniqueName);
  } else {
    // For seed data or E2E create, check the original name with testId
    const uName = uniqueName(name);
    common.createdAdmissions.set(name, { uniqueName: uName });
    await expect(page.locator('#admissions-list')).toContainText(uName);
  }
});

When('I click Edit on admission {string}', async ({ page }, name) => {
  await page.locator('.tab[data-tab="admissions"]').click();
  const adm = common.createdAdmissions.get(name);
  await page.locator(`#admissions-list tr[data-id="${adm.id}"] button`).filter({ hasText: 'Edit' }).click();
});

When('I fill in the admission name {string}', async ({ page }, name) => {
  const uName = uniqueName(name);
  common.createdAdmissions.set(name, { uniqueName: uName });
  await page.locator('#admission-name').fill(uName);
});

When('I change the admission name to {string}', async ({ page }, name) => {
  const uName = uniqueName(name);
  common.createdAdmissions.set(name, { uniqueName: uName });
  await page.locator('#admission-name').fill(uName);
});

When('I click Delete on admission {string}', async ({ page }, name) => {
  await page.locator('.tab[data-tab="admissions"]').click();
  const adm = common.createdAdmissions.get(name);
  await page.locator(`#admissions-list tr[data-id="${adm.id}"] button`).filter({ hasText: 'Delete' }).click();
});

Then('{string} should not be in the admissions list', async ({ page }, name) => {
  const adm = common.createdAdmissions.get(name);
  await expect(page.locator('#admissions-list')).not.toContainText(adm.uniqueName);
});
