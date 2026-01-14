@ADM-MNG-001
Feature: Admission Management

  @implemented
  Scenario: View admissions list
    Given I am on the homepage
    Then I should see admissions in the list

  @implemented
  Scenario: Create a new admission
    Given I am on the homepage
    And an organization "Harvard University" exists
    When I click the Add Admission button
    And I fill in the admission name "UHG 2025"
    And I fill in "2025-01-15" as the application opens date
    And I fill in "2025-04-15" as the application deadline
    And I select admission organization "Harvard University"
    And I click Save
    Then I should see "UHG 2025" in the admissions list

  @implemented
  Scenario: Edit an admission
    Given I am on the homepage
    And an admission "UHG 2024" exists
    When I click Edit on admission "UHG 2024"
    And I change the admission name to "UHG 2024 - Extended"
    And I click Save
    Then I should see "UHG 2024 - Extended" in the admissions list

  @implemented
  Scenario: Delete an admission
    Given I am on the homepage
    And an admission "Test Admission" exists
    When I click Delete on admission "Test Admission"
    Then "Test Admission" should not be in the admissions list
