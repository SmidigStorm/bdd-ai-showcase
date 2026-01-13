@ORG-MNG-002
Feature: Organization API
  As a developer
  I want to manage organizations via API
  So that I can integrate with the system programmatically

  Background:
    Given I am logged in as an admin

  Rule: Admins can create organizations with required fields

    @implemented
    Scenario: Create a new organization
      When I create an organization with:
        | name        | Springfield University |
        | level       | UNIVERSITY             |
        | category    | LIBERAL_ARTS           |
        | description | A leading institution  |
      Then the organization should be created successfully
      And the organization should have a unique ID

    @implemented
    Scenario: Create organization without optional description
      When I create an organization with:
        | name     | Tech College    |
        | level    | COLLEGE         |
        | category | TECHNICAL       |
      Then the organization should be created successfully

  Rule: Admins can view organizations

    @implemented
    Scenario: View all organizations
      Given the following organizations exist:
        | name                   | level      | category     |
        | Springfield University | UNIVERSITY | LIBERAL_ARTS |
        | Tech College           | COLLEGE    | TECHNICAL    |
      When I view all organizations
      Then I should see 2 organizations

    @implemented
    Scenario: View a single organization by ID
      Given an organization "Springfield University" exists
      When I view the organization "Springfield University"
      Then I should see the organization details

  Rule: Admins can update organizations

    @implemented
    Scenario: Update organization name
      Given an organization "Old Name University" exists
      When I update the organization name to "New Name University"
      Then the organization name should be "New Name University"

    @implemented
    Scenario: Update organization category
      Given an organization "Springfield University" exists with category "LIBERAL_ARTS"
      When I update the organization category to "RESEARCH"
      Then the organization category should be "RESEARCH"

  Rule: Admins can soft delete organizations

    @implemented
    Scenario: Delete an organization
      Given an organization "Closing College" exists
      When I delete the organization "Closing College"
      Then the organization should be marked as deleted
      And the organization should not appear in the organization list
