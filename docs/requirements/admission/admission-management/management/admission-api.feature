@ADM-MNG-002
Feature: Admission API
  As a developer
  I want to manage admissions via API
  So that I can integrate with the system programmatically

  Background:
    Given I am logged in as an admin

  Rule: Admins can create admissions with required fields

    @implemented
    Scenario: Create a new admission
      When I create an admission with:
        | name                | UHG 2025                       |
        | description         | Bachelor admissions for 2025   |
        | applicationOpens    | 2025-01-15T00:00:00Z           |
        | applicationDeadline | 2025-04-15T23:59:59Z           |
      Then the admission should be created successfully
      And the admission should have a unique ID
      And the admission status should be "PLANNED"

    @implemented
    Scenario: Create admission without optional description
      When I create an admission with:
        | name                | Local Admission 2025   |
        | applicationOpens    | 2025-02-01T00:00:00Z   |
        | applicationDeadline | 2025-03-01T23:59:59Z   |
      Then the admission should be created successfully

  Rule: Admins can view admissions

    @implemented
    Scenario: View all admissions
      Given the following admissions exist:
        | name     | applicationOpens         | applicationDeadline      |
        | UHG 2025 | 2025-01-15T00:00:00Z     | 2025-04-15T23:59:59Z     |
        | UHG 2026 | 2026-01-15T00:00:00Z     | 2026-04-15T23:59:59Z     |
      When I view all admissions
      Then I should see 2 admissions

    @implemented
    Scenario: View a single admission by ID
      Given an admission "UHG 2025" exists
      When I view the admission "UHG 2025"
      Then I should see the admission details

  Rule: Admins can update admissions

    @implemented
    Scenario: Update admission name
      Given an admission "Draft Admission" exists
      When I update the admission name to "Final Admission"
      Then the admission name should be "Final Admission"

    @implemented
    Scenario: Update admission deadline
      Given an admission "UHG 2025" exists with deadline "2025-04-15T23:59:59Z"
      When I update the admission deadline to "2025-04-30T23:59:59Z"
      Then the admission deadline should be "2025-04-30T23:59:59Z"

  Rule: Admins can delete admissions

    @implemented
    Scenario: Delete an admission
      Given an admission "Cancelled Admission" exists
      When I delete the admission "Cancelled Admission"
      Then the admission should be deleted
      And the admission should not appear in the admission list
