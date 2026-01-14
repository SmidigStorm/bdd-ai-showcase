const { createBdd } = require('playwright-bdd');
const { Given, When, Then } = createBdd();

// Education API steps

When('I create an education with:', async ({}, dataTable) => {
  // Step: When I create an education with:
  // TODO: implement
});

Then('the education should be created successfully', async ({}) => {
  // Step: Then the education should be created successfully
  // TODO: implement
});

Then('the education should have a unique ID', async ({}) => {
  // Step: And the education should have a unique ID
  // TODO: implement
});

Given('the following educations exist:', async ({}, dataTable) => {
  // Step: Given the following educations exist:
  // TODO: implement
});

When('I view all educations', async ({}) => {
  // Step: When I view all educations
  // TODO: implement
});

Then('I should see {int} educations', async ({}, arg) => {
  // Step: Then I should see 2 educations
  // TODO: implement
});

Given('an education {string} exists', async ({}, arg) => {
  // Step: Given an education "Bachelor of Computer Science" exists
  // TODO: implement
});

When('I view the education {string}', async ({}, arg) => {
  // Step: When I view the education "Bachelor of Computer Science"
  // TODO: implement
});

Then('I should see the education details', async ({}) => {
  // Step: Then I should see the education details
  // TODO: implement
});

When('I update the education name to {string}', async ({}, arg) => {
  // Step: When I update the education name to "New Program Name"
  // TODO: implement
});

Then('the education name should be {string}', async ({}, arg) => {
  // Step: Then the education name should be "New Program Name"
  // TODO: implement
});

Given('an education {string} exists with level {string}', async ({}, arg, arg1) => {
  // Step: Given an education "Certificate Program" exists with level "CERTIFICATE"
  // TODO: implement
});

When('I update the education level to {string}', async ({}, arg) => {
  // Step: When I update the education level to "BACHELOR"
  // TODO: implement
});

Then('the education level should be {string}', async ({}, arg) => {
  // Step: Then the education level should be "BACHELOR"
  // TODO: implement
});

When('I delete the education {string}', async ({}, arg) => {
  // Step: When I delete the education "Discontinued Program"
  // TODO: implement
});

Then('the education should be deleted', async ({}) => {
  // Step: Then the education should be deleted
  // TODO: implement
});

Then('the education should not appear in the education list', async ({}) => {
  // Step: And the education should not appear in the education list
  // TODO: implement
});

// Education E2E steps

Then('I should see educations in the list', async ({}) => {
  // Step: Then I should see educations in the list
  // TODO: implement
});

When('I click the Add Education button', async ({}) => {
  // Step: When I click the Add Education button
  // TODO: implement
});

When('I fill in {string} as the code', async ({}, arg) => {
  // Step: And I fill in "BCS-2024" as the code
  // TODO: implement
});

When('I select {string} as the level', async ({}, arg) => {
  // Step: And I select "BACHELOR" as the level
  // TODO: implement
});

Then('I should see {string} in the educations list', async ({}, arg) => {
  // Step: Then I should see "Bachelor of Computer Science" in the educations list
  // TODO: implement
});

When('I click Edit on education {string}', async ({}, arg) => {
  // Step: When I click Edit on education "Master of Data Science"
  // TODO: implement
});

When('I click Delete on education {string}', async ({}, arg) => {
  // Step: When I click Delete on education "Certificate in Project Management"
  // TODO: implement
});

Then('{string} should not be in the educations list', async ({}, arg) => {
  // Step: Then "Certificate in Project Management" should not be in the educations list
  // TODO: implement
});
