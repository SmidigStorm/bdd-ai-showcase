@EDU-MNG-001
Feature: Education Management

  @implemented
  Scenario: View educations list
    Given I am on the homepage
    Then I should see educations in the list

  @implemented
  Scenario: Create a new education
    Given I am on the homepage
    And an organization "Harvard University" exists
    When I click the Add Education button
    And I fill in "Bachelor of Computer Science" as the education name
    And I fill in "BCS-2024" as the code
    And I select "BACHELOR" as the level
    And I select organization "Harvard University"
    And I click Save Education
    Then I should see "Bachelor of Computer Science" in the educations list

  @implemented
  Scenario: Edit an education
    Given I am on the homepage
    And an organization "MIT" exists
    And an education "Master of Data Science" exists
    When I click Edit on education "Master of Data Science"
    And I change the education name to "Master of Applied Data Science"
    And I click Save Education
    Then I should see "Master of Applied Data Science" in the educations list

  @implemented
  Scenario: Delete an education
    Given I am on the homepage
    And an organization "Stanford" exists
    And an education "Certificate in Project Management" exists
    When I click Delete on education "Certificate in Project Management"
    Then "Certificate in Project Management" should not be in the educations list
