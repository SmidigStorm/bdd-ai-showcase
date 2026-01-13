const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');

const { Given, When, Then } = createBdd();

let currentOrganization = null;
let createdOrganizations = new Map();

// Background
Given('I am logged in as an admin', async ({ page }) => {
  // No auth for now - admin access is assumed
});

// Create organizations
When('I create an organization with:', async ({ request }, dataTable) => {
  const data = {};
  dataTable.raw().forEach(([key, value]) => {
    data[key] = value;
  });

  const response = await request.post('/api/organizations', { data });
  expect(response.status()).toBe(201);
  currentOrganization = await response.json();
  createdOrganizations.set(currentOrganization.name, currentOrganization);
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
  // Clear any existing test data by creating fresh orgs
  const rows = dataTable.hashes();
  for (const row of rows) {
    const response = await request.post('/api/organizations', {
      data: {
        name: row.name,
        level: row.level,
        category: row.category,
      },
    });
    const org = await response.json();
    createdOrganizations.set(org.name, org);
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

Given('an organization {string} exists', async ({ request }, name) => {
  const response = await request.post('/api/organizations', {
    data: {
      name,
      level: 'UNIVERSITY',
      category: 'LIBERAL_ARTS',
    },
  });
  const org = await response.json();
  createdOrganizations.set(name, org);
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
  const response = await request.post('/api/organizations', {
    data: {
      name,
      level: 'UNIVERSITY',
      category,
    },
  });
  const org = await response.json();
  createdOrganizations.set(name, org);
});

When('I update the organization name to {string}', async ({ request }, newName) => {
  const orgNames = Array.from(createdOrganizations.keys());
  const lastOrgName = orgNames[orgNames.length - 1];
  const org = createdOrganizations.get(lastOrgName);

  const response = await request.put(`/api/organizations/${org.id}`, {
    data: { name: newName },
  });
  expect(response.status()).toBe(200);
  currentOrganization = await response.json();
  createdOrganizations.set(newName, currentOrganization);
});

Then('the organization name should be {string}', async ({}, expectedName) => {
  expect(currentOrganization.name).toBe(expectedName);
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
  const response = await request.get('/api/organizations');
  const orgs = await response.json();
  const orgNames = orgs.map((o) => o.name);
  expect(orgNames).not.toContain('Closing College');
});
