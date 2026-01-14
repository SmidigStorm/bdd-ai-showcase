@EDU-MNG-001
Feature: Education Management

  Scenario: View educations list
    Given I am on the homepage
    Then I should see educations in the list

  Scenario: Create a new education
    Given I am on the homepage
    When I click the Add Education button
    And I fill in "Bachelor of Computer Science" as the name
    And I fill in "BCS-2024" as the code
    And I select "BACHELOR" as the level
    And I click Save
    Then I should see "Bachelor of Computer Science" in the educations list

  Scenario: Edit an education
    Given I am on the homepage
    And an education "Master of Data Science" exists
    When I click Edit on education "Master of Data Science"
    And I change the name to "Master of Applied Data Science"
    And I click Save
    Then I should see "Master of Applied Data Science" in the educations list

  Scenario: Delete an education
    Given I am on the homepage
    And an education "Certificate in Project Management" exists
    When I click Delete on education "Certificate in Project Management"
    Then "Certificate in Project Management" should not be in the educations list
