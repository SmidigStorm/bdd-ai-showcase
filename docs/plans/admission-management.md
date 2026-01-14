# Admission Management Implementation Plan

## Summary

Implement full CRUD functionality for Admission entities with:
- REST API endpoints
- Admissions tab in UI
- Organization relationship (required FK)
- BDD tests (E2E and API)

## Requirements

- [ ] ADM-MNG-001: Admission Management (E2E) - Browser CRUD operations
- [ ] ADM-MNG-002: Admission API - RESTful endpoints

## Architecture Approach

**Simple approach**: Follow Education pattern exactly, adding Admissions as third tab.

## Codebase Patterns

- **Repository Pattern**: `src/education-repository.js`
- **Routes Pattern**: `src/education-routes.js`
- **Step Definitions**: `tests/steps/education.js` + `tests/steps/common.js`
- **Frontend Tabs**: `src/public/index.html`

## Implementation Steps

### Step 1: Create Admission Repository

**Implements**: ADM-MNG-002
**File**: `src/admission-repository.js` (new)

- Entity fields: id, name, description, applicationOpens, applicationDeadline, status, organizationId, deleted
- Methods: findAll(), findById(), create(), update(), softDelete(), reset()
- Default status: PLANNED
- Seed data: 1-2 sample admissions

### Step 2: Create Admission Routes

**Implements**: ADM-MNG-002
**File**: `src/admission-routes.js` (new)

REST endpoints:
- GET /api/admissions - List all
- GET /api/admissions/:id - Get single
- POST /api/admissions - Create (validate: name, applicationOpens, applicationDeadline, organizationId)
- PUT /api/admissions/:id - Update
- DELETE /api/admissions/:id - Soft delete

### Step 3: Mount Routes in Server

**Implements**: ADM-MNG-002
**File**: `src/server.js` (modify)

Add:
```javascript
const admissionRoutes = require('./admission-routes');
app.use('/api/admissions', admissionRoutes);
```

### Step 4: Add Admissions Tab to UI

**Implements**: ADM-MNG-001
**File**: `src/public/index.html` (modify)

- Add "Admissions" tab button
- Add admissions-tab content div with form and table
- Form fields: name, applicationOpens (date), applicationDeadline (date), organization (dropdown), description
- Table columns: Name, Opens, Deadline, Organization, Actions
- Add loadAdmissions(), showAdmissionForm(), hideAdmissionForm(), editAdmission(), deleteAdmission()

### Step 5: Implement Step Definitions

**Implements**: ADM-MNG-001, ADM-MNG-002
**File**: `tests/steps/admission.js` (replace)

- Use common.js for shared steps
- API steps for CRUD operations
- E2E steps for browser interactions
- Handle date fields appropriately

### Step 6: Update Feature Files and Run Tests

**Implements**: ADM-MNG-001, ADM-MNG-002
**Files**:
- `docs/requirements/admission/admission-management/management/admission.feature`
- `docs/requirements/admission/admission-management/management/admission-api.feature`

Changes:
- Add organization setup to Background/scenarios
- Add @implemented tags
- Run tests to verify

## Acceptance Criteria

- [ ] Admission API CRUD operations work (201, 200, 204 status codes)
- [ ] Admission list displays in UI on Admissions tab
- [ ] Create admission form shows date pickers and organization dropdown
- [ ] Edit/Delete admission works
- [ ] Tab switching works for all 3 tabs
- [ ] All BDD scenarios pass with @implemented tag

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Add organizationId | User preference for consistency with Education |
| Follow Education pattern | Proven pattern, fast implementation |
| Third tab in UI | Natural extension of existing tabs |
| Default status PLANNED | As per entity documentation |
