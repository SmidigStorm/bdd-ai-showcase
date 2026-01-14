const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const common = require('./common');

const { Given, When, Then } = createBdd();

let currentEducation = null;

function uniqueName(name) {
  return common.uniqueName(name);
}

// Create educations
When('I create an education with:', async ({ request }, dataTable) => {
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

  const response = await request.post('/api/educations', { data });
  expect(response.status()).toBe(201);
  currentEducation = await response.json();
  if (originalName) {
    common.createdEducations.set(originalName, { id: currentEducation.id, uniqueName: data.name, ...currentEducation });
  }
});

Then('the education should be created successfully', async () => {
  expect(currentEducation).toBeTruthy();
  expect(currentEducation.name).toBeTruthy();
});

Then('the education should have a unique ID', async () => {
  expect(currentEducation.id).toBeTruthy();
  expect(currentEducation.id).toMatch(/^[0-9a-f-]{36}$/);
});

// View educations
Given('the following educations exist:', async ({ request }, dataTable) => {
  const rows = dataTable.hashes();
  for (const row of rows) {
    const uName = uniqueName(row.name);

    let organizationId = row.organizationId;
    if (row.organization) {
      const org = common.createdOrganizations.get(row.organization);
      if (org) {
        organizationId = org.id;
      }
    }

    const response = await request.post('/api/educations', {
      data: {
        name: uName,
        code: row.code,
        level: row.level,
        organizationId,
      },
    });
    const edu = await response.json();
    common.createdEducations.set(row.name, { id: edu.id, uniqueName: uName, ...edu });
  }
});

When('I view all educations', async ({ request }) => {
  const response = await request.get('/api/educations');
  expect(response.status()).toBe(200);
  currentEducation = await response.json();
});

Then('I should see {int} educations', async ({}, count) => {
  expect(Array.isArray(currentEducation)).toBe(true);
  expect(currentEducation.length).toBeGreaterThanOrEqual(count);
});

Given('an education {string} exists', async ({ page, request }, name) => {
  // Need an organization first
  if (common.createdOrganizations.size === 0) {
    const uName = uniqueName('Test University');
    const response = await request.post('/api/organizations', {
      data: { name: uName, level: 'UNIVERSITY', category: 'LIBERAL_ARTS' },
    });
    const org = await response.json();
    common.createdOrganizations.set('Test University', { id: org.id, uniqueName: uName, ...org });
  }
  const org = Array.from(common.createdOrganizations.values())[0];

  const uName = uniqueName(name);
  const response = await request.post('/api/educations', {
    data: {
      name: uName,
      code: 'TEST-001',
      level: 'BACHELOR',
      organizationId: org.id,
    },
  });
  const edu = await response.json();
  common.createdEducations.set(name, { id: edu.id, uniqueName: uName, ...edu });
  if (page) {
    await page.reload();
  }
});

When('I view the education {string}', async ({ request }, name) => {
  const edu = common.createdEducations.get(name);
  const response = await request.get(`/api/educations/${edu.id}`);
  expect(response.status()).toBe(200);
  currentEducation = await response.json();
});

Then('I should see the education details', async () => {
  expect(currentEducation).toBeTruthy();
  expect(currentEducation.id).toBeTruthy();
  expect(currentEducation.name).toBeTruthy();
});

// Update educations
Given('an education {string} exists with level {string}', async ({ request }, name, level) => {
  // Need an organization first
  if (common.createdOrganizations.size === 0) {
    const uName = uniqueName('Test University');
    const response = await request.post('/api/organizations', {
      data: { name: uName, level: 'UNIVERSITY', category: 'LIBERAL_ARTS' },
    });
    const org = await response.json();
    common.createdOrganizations.set('Test University', { id: org.id, uniqueName: uName, ...org });
  }
  const org = Array.from(common.createdOrganizations.values())[0];

  const uName = uniqueName(name);
  const response = await request.post('/api/educations', {
    data: {
      name: uName,
      code: 'TEST-001',
      level,
      organizationId: org.id,
    },
  });
  const edu = await response.json();
  common.createdEducations.set(name, { id: edu.id, uniqueName: uName, ...edu });
});

When('I update the education name to {string}', async ({ request }, newName) => {
  const eduNames = Array.from(common.createdEducations.keys());
  const lastEduName = eduNames[eduNames.length - 1];
  const edu = common.createdEducations.get(lastEduName);

  const uName = uniqueName(newName);
  const response = await request.put(`/api/educations/${edu.id}`, {
    data: { name: uName },
  });
  expect(response.status()).toBe(200);
  currentEducation = await response.json();
  common.createdEducations.set(newName, { id: edu.id, uniqueName: uName, ...currentEducation });
});

Then('the education name should be {string}', async ({}, expectedName) => {
  const uName = uniqueName(expectedName);
  expect(currentEducation.name).toBe(uName);
});

When('I update the education level to {string}', async ({ request }, newLevel) => {
  const eduNames = Array.from(common.createdEducations.keys());
  const lastEduName = eduNames[eduNames.length - 1];
  const edu = common.createdEducations.get(lastEduName);

  const response = await request.put(`/api/educations/${edu.id}`, {
    data: { level: newLevel },
  });
  expect(response.status()).toBe(200);
  currentEducation = await response.json();
});

Then('the education level should be {string}', async ({}, expectedLevel) => {
  expect(currentEducation.level).toBe(expectedLevel);
});

// Delete educations
When('I delete the education {string}', async ({ request }, name) => {
  const edu = common.createdEducations.get(name);
  const response = await request.delete(`/api/educations/${edu.id}`);
  expect(response.status()).toBe(204);
});

Then('the education should be deleted', async () => {
  // Soft delete - verified by next step
});

Then('the education should not appear in the education list', async ({ request }) => {
  const response = await request.get('/api/educations');
  const edus = await response.json();
  const eduNames = Array.from(common.createdEducations.values()).map(e => e.uniqueName);
  const apiNames = edus.map((e) => e.name);

  for (const name of eduNames) {
    if (name.includes('Discontinued')) {
      expect(apiNames).not.toContain(name);
    }
  }
});

// E2E Browser Steps
Then('I should see educations in the list', async ({ page }) => {
  await page.locator('.tab[data-tab="educations"]').click();
  await expect(page.locator('#educations-list tr[data-id]').first()).toBeVisible();
});

When('I click the Add Education button', async ({ page }) => {
  await page.locator('.tab[data-tab="educations"]').click();
  await page.locator('#add-education-btn').click();
});

When('I fill in {string} as the education name', async ({ page }, name) => {
  const uName = uniqueName(name);
  common.createdEducations.set(name, { uniqueName: uName });
  await page.locator('#education-name').fill(uName);
});

When('I fill in {string} as the code', async ({ page }, code) => {
  await page.locator('#education-code').fill(code);
});

When('I select {string} as the level', async ({ page }, level) => {
  await page.locator('#education-level').selectOption(level);
});

When('I select organization {string}', async ({ page }, name) => {
  const org = common.createdOrganizations.get(name);
  await page.locator('#education-organization').selectOption(org.id);
});

When('I click Save Education', async ({ page }) => {
  await page.locator('#submit-education-btn').click();
});

Then('I should see {string} in the educations list', async ({ page }, name) => {
  const edu = common.createdEducations.get(name);
  await expect(page.locator('#educations-list')).toContainText(edu.uniqueName);
});

When('I click Edit on education {string}', async ({ page }, name) => {
  await page.locator('.tab[data-tab="educations"]').click();
  const edu = common.createdEducations.get(name);
  await page.locator(`#educations-list tr[data-id="${edu.id}"] button`).filter({ hasText: 'Edit' }).click();
});

When('I change the education name to {string}', async ({ page }, name) => {
  const uName = uniqueName(name);
  common.createdEducations.set(name, { uniqueName: uName });
  await page.locator('#education-name').fill(uName);
});

When('I click Delete on education {string}', async ({ page }, name) => {
  await page.locator('.tab[data-tab="educations"]').click();
  const edu = common.createdEducations.get(name);
  await page.locator(`#educations-list tr[data-id="${edu.id}"] button`).filter({ hasText: 'Delete' }).click();
});

Then('{string} should not be in the educations list', async ({ page }, name) => {
  const edu = common.createdEducations.get(name);
  await expect(page.locator('#educations-list')).not.toContainText(edu.uniqueName);
});
