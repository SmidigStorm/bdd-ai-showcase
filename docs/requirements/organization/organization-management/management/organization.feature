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
    And I fill in "Harvard University" as the name
    And I click Save
    Then I should see "Harvard University" in the list

  @implemented
  Scenario: Edit an organization
    Given I am on the homepage
    And an organization "MIT" exists
    When I click Edit on "MIT"
    And I change the name to "Massachusetts Institute of Technology"
    And I click Save
    Then I should see "Massachusetts Institute of Technology" in the list

  @implemented
  Scenario: Delete an organization
    Given I am on the homepage
    And an organization "Closing Academy" exists
    When I click Delete on "Closing Academy"
    Then "Closing Academy" should not be in the list
