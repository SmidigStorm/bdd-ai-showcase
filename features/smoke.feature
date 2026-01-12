Feature: Smoke Test

  Scenario: Homepage loads successfully
    Given I am on the homepage
    Then I should see "Admissions Portal"
