# Education Management Implementation Plan

## Summary

Implement full CRUD functionality for Education entities with:
- REST API endpoints
- Tab-based UI (Organizations | Educations)
- Organization relationship (required FK)
- BDD tests (E2E and API)

## Requirements

- [ ] EDU-MNG-001: Education Management (E2E) - Browser CRUD operations
- [ ] EDU-MNG-002: Education API - RESTful endpoints

## Architecture Approach

**Pragmatic approach**: Follow existing Organization patterns exactly, adding:
- Required `organizationId` foreign key
- Tab-based UI navigation
- Organization dropdown in Education form

## Codebase Patterns

- **Repository Pattern**: `src/organization-repository.js:37-87`
- **Routes Pattern**: `src/organization-routes.js:1-49`
- **Step Definitions**: `tests/steps/organization.js:1-228`
- **Frontend CRUD**: `src/public/index.html:67-163`

## Implementation Steps

### Step 1: Create Education Repository

**Implements**: EDU-MNG-002
**File**: `src/education-repository.js` (new)

Create in-memory repository following organization pattern:
- Entity fields: `id`, `name`, `code`, `level`, `description`, `organizationId`, `deleted`
- Methods: `findAll()`, `findById()`, `create()`, `update()`, `softDelete()`, `reset()`
- Seed data: 2-3 sample educations linked to seed organizations
- Level enum: BACHELOR, MASTER, DOCTORATE, CERTIFICATE

### Step 2: Create Education Routes

**Implements**: EDU-MNG-002
**File**: `src/education-routes.js` (new)

REST endpoints:
- `GET /api/educations` - List all (filter deleted)
- `GET /api/educations/:id` - Get single
- `POST /api/educations` - Create (validate: name, code, level, organizationId required)
- `PUT /api/educations/:id` - Update
- `DELETE /api/educations/:id` - Soft delete

### Step 3: Mount Routes in Server

**Implements**: EDU-MNG-002
**File**: `src/server.js` (modify)

Add:
```javascript
const educationRoutes = require('./education-routes');
app.use('/api/educations', educationRoutes);
```

### Step 4: Update Frontend with Tabs UI

**Implements**: EDU-MNG-001
**File**: `src/public/index.html` (modify)

Changes:
1. Add tab navigation CSS and HTML:
   ```html
   <div class="tabs">
     <button class="tab active" data-tab="organizations">Organizations</button>
     <button class="tab" data-tab="educations">Educations</button>
   </div>
   ```

2. Wrap existing organization content in `<div id="organizations-tab" class="tab-content active">`

3. Add education tab content `<div id="educations-tab" class="tab-content">`:
   - Add Education button (`#add-education-btn`)
   - Education form with fields: name, code, level (dropdown), organization (dropdown), description
   - Education table with columns: Name, Code, Level, Organization, Actions

4. Load both datasets on page init:
   ```javascript
   async function init() {
     await loadOrganizations();
     await loadEducations();
   }
   ```

5. Tab switching JavaScript:
   ```javascript
   document.querySelectorAll('.tab').forEach(tab => {
     tab.addEventListener('click', () => switchTab(tab.dataset.tab));
   });
   ```

### Step 5: Implement Step Definitions

**Implements**: EDU-MNG-001, EDU-MNG-002
**File**: `tests/steps/education.js` (replace)

Structure:
- Test isolation: `testId`, `createdEducations` Map, `uniqueName()`
- API steps matching organization.js pattern
- E2E steps for education-specific interactions
- Shared step for creating test organization first

Key steps to implement:
- `Given I am logged in as an admin` - Already exists in organization.js
- `Given an organization {string} exists` - Reuse from organization.js
- `When I create an education with:` - API create with organizationId
- `When I click the Add Education button` - E2E
- `When I fill in {string} as the code` - E2E
- `When I select {string} as the level` - E2E
- `When I select organization {string}` - E2E (new)

### Step 6: Update Feature Files

**Implements**: EDU-MNG-001, EDU-MNG-002
**Files**:
- `docs/requirements/education/education-management/management/education.feature`
- `docs/requirements/education/education-management/management/education-api.feature`

Changes:
1. Add `Given an organization "X" exists` before education creation scenarios
2. Add organizationId to API data tables
3. Add `@implemented` tag to all scenarios
4. Update E2E scenarios to select organization in form

### Step 7: Run Tests and Verify

**Implements**: EDU-MNG-001, EDU-MNG-002
**Command**: `npm test`

Verify:
- All education API scenarios pass
- All education E2E scenarios pass
- No regressions in organization tests

## Acceptance Criteria

- [ ] Education API CRUD operations work (201, 200, 204 status codes)
- [ ] Education list displays in UI on Educations tab
- [ ] Create education form shows organization dropdown
- [ ] Edit education works with inline editing
- [ ] Delete education removes from list
- [ ] Tab switching works between Organizations and Educations
- [ ] All BDD scenarios pass with @implemented tag

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Required organizationId | User requirement - every education belongs to an organization |
| Load both on page init | User preference for faster tab switching |
| Org dropdown in form | User requirement - visible relationship in UI |
| Update feature files | User preference for explicit test scenarios |
| Follow existing patterns | Consistency, faster implementation, proven patterns |
| Soft delete | Matches organization pattern, preserves data |

## Open Questions

None - all questions resolved during planning phase.

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/education-repository.js` | Create | In-memory CRUD with organizationId |
| `src/education-routes.js` | Create | REST API endpoints |
| `src/server.js` | Modify | Mount education routes |
| `src/public/index.html` | Modify | Add tabs UI and education CRUD |
| `tests/steps/education.js` | Replace | Full step definitions |
| `education.feature` | Modify | Add org setup, @implemented |
| `education-api.feature` | Modify | Add organizationId, @implemented |
