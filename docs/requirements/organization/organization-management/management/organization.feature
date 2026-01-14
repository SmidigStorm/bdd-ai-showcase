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
    And I fill in the organization name "Harvard University"
    And I click Save
    Then I should see "Harvard University" in the list

  @implemented
  Scenario: Edit an organization
    Given I am on the homepage
    And an organization "MIT" exists
    When I click Edit on organization "MIT"
    And I change the organization name to "Massachusetts Institute of Technology"
    And I click Save
    Then I should see "Massachusetts Institute of Technology" in the list

  @implemented
  Scenario: Delete an organization
    Given I am on the homepage
    And an organization "Closing Academy" exists
    When I click Delete on organization "Closing Academy"
    Then "Closing Academy" should not be in the list
