# Example Mapping: Add an Education to an Admission

> **Workshop held:** 2024-01-15
> **Participants:** Anna (Product Owner), Erik (Developer), Maria (QA)
> **Duration:** 25 minutes

---

## 🟨 User Story

**As an** admissions officer
**I want to** add an education program to an admission round
**So that** students can apply for that program during the admission period

---

## 🟦 Rules & 🟩 Examples

### Rule 1: Only active educations can be added to an admission

| # | Example | Expected Result |
|---|---------|-----------------|
| 1 | Given education "Bachelor of Computer Science" with status ACTIVE<br>When I add it to admission "UHG 2025"<br>Then the education should be added | ✅ Education added successfully |
| 2 | Given education "Master of Philosophy" with status DRAFT<br>When I add it to admission "UHG 2025"<br>Then I should see an error | ❌ Error: Education is not active |
| 3 | Given education "Certificate in COBOL" with status DISCONTINUED<br>When I add it to admission "UHG 2025"<br>Then I should see an error | ❌ Error: Education is no longer offered |

---

### Rule 2: The education must belong to the same organization as the admission

| # | Example | Expected Result |
|---|---------|-----------------|
| 1 | Given admission "UHG 2025" owned by "University of Oslo"<br>And education "Bachelor of Law" offered by "University of Oslo"<br>When I add the education to the admission<br>Then the education should be added | ✅ Education added |
| 2 | Given admission "UHG 2025" owned by "University of Oslo"<br>And education "Bachelor of Engineering" offered by "NTNU"<br>When I add the education to the admission<br>Then I should see an error | ❌ Error: Education not offered by this organization |

---

### Rule 3: An education can only be added once to an admission

| # | Example | Expected Result |
|---|---------|-----------------|
| 1 | Given admission "UHG 2025" with no educations<br>When I add education "Bachelor of Computer Science"<br>Then the education should be added | ✅ Education added |
| 2 | Given admission "UHG 2025" already includes "Bachelor of Computer Science"<br>When I add education "Bachelor of Computer Science" again<br>Then I should see an error | ❌ Error: Education already in admission |

---

### Rule 4: Educations can only be added when the admission is in PLANNED status

| # | Example | Expected Result |
|---|---------|-----------------|
| 1 | Given admission "UHG 2025" with status PLANNED<br>When I add an education<br>Then the education should be added | ✅ Education added |
| 2 | Given admission "UHG 2025" with status OPEN_FOR_APPLICATION<br>When I add an education<br>Then I should see an error | ❌ Error: Cannot modify admission after applications open |
| 3 | Given admission "UHG 2025" with status APPLICATIONS_CLOSED<br>When I add an education<br>Then I should see an error | ❌ Error: Cannot modify closed admission |
| 4 | Given admission "UHG 2024" with status DONE<br>When I add an education<br>Then I should see an error | ❌ Error: Cannot modify completed admission |

---

### Rule 5: Removing an education from an admission is allowed in PLANNED status

| # | Example | Expected Result |
|---|---------|-----------------|
| 1 | Given admission "UHG 2025" with status PLANNED includes "Bachelor of Arts"<br>When I remove the education<br>Then the education should be removed | ✅ Education removed |
| 2 | Given admission "UHG 2025" with status OPEN_FOR_APPLICATION includes "Bachelor of Arts"<br>When I remove the education<br>Then I should see an error | ❌ Error: Cannot modify admission after applications open |

---

## 🟥 Open Questions

| # | Question | Status | Answer |
|---|----------|--------|--------|
| 1 | Can an education be in multiple admissions at the same time? | ✅ Answered | Yes, the same education can be in UHG 2025 and Local 2025 (Anna) |
| 2 | Is there a maximum number of educations per admission? | ✅ Answered | No limit for now (Anna) |
| 3 | Should we track who added the education and when? | ✅ Answered | Yes, for audit purposes (Erik) |
| 4 | What happens to applications if an education is removed? | ❓ Open | — |
| 5 | Can we add educations in bulk (import from previous admission)? | ❓ Open | Nice to have, not MVP (Anna) |

---

## Discovered Acceptance Criteria

From this workshop, the feature should:

1. ✅ Validate education status is ACTIVE
2. ✅ Validate education belongs to same organization as admission
3. ✅ Prevent duplicate educations in same admission
4. ✅ Only allow modifications when admission is PLANNED
5. ✅ Support removing educations (in PLANNED status)
6. ✅ Track audit info (who/when)

---

## Next Steps

1. [x] Document Admission entity *(done)*
2. [x] Document Education entity *(done)*
3. [ ] Create requirement ADM-MNG-003 for this feature
4. [ ] Convert examples to Gherkin scenarios
5. [ ] Resolve open questions before implementation

---

## References

- [Introducing Example Mapping | Cucumber](https://cucumber.io/blog/bdd/example-mapping-introduction/)
- [Example Mapping | Cucumber Docs](https://cucumber.io/docs/bdd/example-mapping/)
