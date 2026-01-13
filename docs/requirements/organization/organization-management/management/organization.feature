@ORG-MNG-001
Feature: Organization Management

  @implemented
  Scenario: View organizations list
    Given I am on the homepage
    Then I should see organizations in the list

  @implemented
  Scenario: Create a new organization
    Given I am on the homepage
    When I click the Add Organization button
    And I fill in a unique name
    And I click Save
    Then I should see my organization in the list

  @implemented
  Scenario: Edit an organization
    Given I am on the homepage
    And I create a test organization via API
    And I refresh the page
    When I click Edit on my organization
    And I change the name to something unique
    And I click Save
    Then I should see the updated name in the list

  @implemented
  Scenario: Delete an organization
    Given I am on the homepage
    And I create a test organization via API
    And I refresh the page
    When I click Delete on my organization
    Then my organization should not be in the list
