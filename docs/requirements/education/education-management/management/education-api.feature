@EDU-MNG-002
Feature: Education API
  As a developer
  I want to manage educations via API
  So that I can integrate with the system programmatically

  Background:
    Given I am logged in as an admin

  Rule: Admins can create educations with required fields

    Scenario: Create a new education
      When I create an education with:
        | name        | Bachelor of Computer Science |
        | code        | BCS-2024                     |
        | level       | BACHELOR                     |
        | description | A comprehensive CS program   |
      Then the education should be created successfully
      And the education should have a unique ID

    Scenario: Create education without optional fields
      When I create an education with:
        | name  | Master of Business Administration |
        | code  | MBA-2024                          |
        | level | MASTER                            |
      Then the education should be created successfully

  Rule: Admins can view educations

    Scenario: View all educations
      Given the following educations exist:
        | name                         | code     | level    |
        | Bachelor of Computer Science | BCS-2024 | BACHELOR |
        | Master of Data Science       | MDS-2024 | MASTER   |
      When I view all educations
      Then I should see 2 educations

    Scenario: View a single education by ID
      Given an education "Bachelor of Computer Science" exists
      When I view the education "Bachelor of Computer Science"
      Then I should see the education details

  Rule: Admins can update educations

    Scenario: Update education name
      Given an education "Old Program Name" exists
      When I update the education name to "New Program Name"
      Then the education name should be "New Program Name"

    Scenario: Update education level
      Given an education "Certificate Program" exists with level "CERTIFICATE"
      When I update the education level to "BACHELOR"
      Then the education level should be "BACHELOR"

  Rule: Admins can delete educations

    Scenario: Delete an education
      Given an education "Discontinued Program" exists
      When I delete the education "Discontinued Program"
      Then the education should be deleted
      And the education should not appear in the education list
