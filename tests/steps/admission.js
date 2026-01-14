const { createBdd } = require('playwright-bdd');
const { Given, When, Then } = createBdd();

// Admission API steps

When('I create an admission with:', async ({}, dataTable) => {
  // Step: When I create an admission with:
  // TODO: implement
});

Then('the admission should be created successfully', async ({}) => {
  // Step: Then the admission should be created successfully
  // TODO: implement
});

Then('the admission should have a unique ID', async ({}) => {
  // Step: And the admission should have a unique ID
  // TODO: implement
});

Then('the admission status should be {string}', async ({}, arg) => {
  // Step: And the admission status should be "PLANNED"
  // TODO: implement
});

Given('the following admissions exist:', async ({}, dataTable) => {
  // Step: Given the following admissions exist:
  // TODO: implement
});

When('I view all admissions', async ({}) => {
  // Step: When I view all admissions
  // TODO: implement
});

Then('I should see {int} admissions', async ({}, arg) => {
  // Step: Then I should see 2 admissions
  // TODO: implement
});

Given('an admission {string} exists', async ({}, arg) => {
  // Step: Given an admission "UHG 2025" exists
  // TODO: implement
});

When('I view the admission {string}', async ({}, arg) => {
  // Step: When I view the admission "UHG 2025"
  // TODO: implement
});

Then('I should see the admission details', async ({}) => {
  // Step: Then I should see the admission details
  // TODO: implement
});

When('I update the admission name to {string}', async ({}, arg) => {
  // Step: When I update the admission name to "Final Admission"
  // TODO: implement
});

Then('the admission name should be {string}', async ({}, arg) => {
  // Step: Then the admission name should be "Final Admission"
  // TODO: implement
});

Given('an admission {string} exists with deadline {string}', async ({}, arg, arg1) => {
  // Step: Given an admission "UHG 2025" exists with deadline "2025-04-15T23:59:59Z"
  // TODO: implement
});

When('I update the admission deadline to {string}', async ({}, arg) => {
  // Step: When I update the admission deadline to "2025-04-30T23:59:59Z"
  // TODO: implement
});

Then('the admission deadline should be {string}', async ({}, arg) => {
  // Step: Then the admission deadline should be "2025-04-30T23:59:59Z"
  // TODO: implement
});

When('I delete the admission {string}', async ({}, arg) => {
  // Step: When I delete the admission "Cancelled Admission"
  // TODO: implement
});

Then('the admission should be deleted', async ({}) => {
  // Step: Then the admission should be deleted
  // TODO: implement
});

Then('the admission should not appear in the admission list', async ({}) => {
  // Step: And the admission should not appear in the admission list
  // TODO: implement
});

// Admission E2E steps

Then('I should see admissions in the list', async ({}) => {
  // Step: Then I should see admissions in the list
  // TODO: implement
});

When('I click the Add Admission button', async ({}) => {
  // Step: When I click the Add Admission button
  // TODO: implement
});

When('I fill in {string} as the application opens date', async ({}, arg) => {
  // Step: And I fill in "2025-01-15" as the application opens date
  // TODO: implement
});

When('I fill in {string} as the application deadline', async ({}, arg) => {
  // Step: And I fill in "2025-04-15" as the application deadline
  // TODO: implement
});

Then('I should see {string} in the admissions list', async ({}, arg) => {
  // Step: Then I should see "UHG 2025" in the admissions list
  // TODO: implement
});

When('I click Edit on admission {string}', async ({}, arg) => {
  // Step: When I click Edit on admission "UHG 2024"
  // TODO: implement
});

When('I click Delete on admission {string}', async ({}, arg) => {
  // Step: When I click Delete on admission "Test Admission"
  // TODO: implement
});

Then('{string} should not be in the admissions list', async ({}, arg) => {
  // Step: Then "Test Admission" should not be in the admissions list
  // TODO: implement
});
