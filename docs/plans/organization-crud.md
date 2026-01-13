# Organization CRUD

## Summary
Implement basic CRUD operations for organizations with a REST API, repository pattern for in-memory storage, and a frontend list view on the homepage.

## Requirements
- [ ] ORG-MNG-001: Organization CRUD
  - Create org with name, level, category (description optional)
  - List all organizations
  - View single organization by ID
  - Update organization name and category
  - Soft delete (hides from list)

## Architecture Approach
- **API**: REST endpoints at `/api/organizations`
- **Data**: Repository pattern with in-memory Map storage
- **Frontend**: Vanilla fetch on homepage
- **Validation**: None (trust input for now)
- **Errors**: HTTP status codes only

## File Structure
```
src/
├── server.js                    # Mount routes, add JSON middleware
├── organization-repository.js   # In-memory storage + seed data
├── organization-routes.js       # REST endpoints
└── public/
    └── index.html               # Organizations list
tests/
└── steps/
    └── organization.js          # BDD step definitions
```

## Implementation Steps

### Step 1: Create Organization Repository
**Implements**: ORG-MNG-001 (data layer)
**File**: `src/organization-repository.js`

Create repository with:
- In-memory Map storage
- CRUD methods: create, findAll, findById, update, softDelete
- Seed data (2-3 sample organizations)
- UUID generation for IDs
- `deleted` flag for soft delete

### Step 2: Create REST Routes
**Implements**: ORG-MNG-001 (API layer)
**File**: `src/organization-routes.js`

Endpoints:
- `GET /api/organizations` - List all (exclude deleted)
- `GET /api/organizations/:id` - Get single
- `POST /api/organizations` - Create new
- `PUT /api/organizations/:id` - Update existing
- `DELETE /api/organizations/:id` - Soft delete

### Step 3: Mount Routes in Server
**Implements**: ORG-MNG-001
**File**: `src/server.js`

Changes:
- Add `express.json()` middleware
- Import and mount organization routes

### Step 4: Update Homepage with Organization List
**Implements**: ORG-MNG-001 (UI)
**File**: `src/public/index.html`

Features:
- Fetch and display organizations on page load
- Show name, level, category in a list/table
- Simple, minimal styling

### Step 5: Create BDD Step Definitions
**Implements**: ORG-MNG-001 (tests)
**File**: `tests/steps/organization.js`

Step definitions for all scenarios in the feature file:
- Admin login (mock/stub for now)
- Create organization with data table
- View organizations
- Update organization
- Delete organization

### Step 6: Add Implementation Tags to Feature File
**File**: `docs/requirements/organization/organization-management/management/organization-crud.feature`

Add `@implemented` tag to each scenario as it's completed:
```gherkin
@implemented
Scenario: Create a new organization
```

This allows running only implemented tests: `npx playwright test --grep @implemented`

## Acceptance Criteria
- [ ] Organizations can be created via API
- [ ] Organizations list displays on homepage
- [ ] Organizations can be updated via API
- [ ] Deleted organizations don't appear in list
- [ ] All BDD scenarios pass
- [ ] Feature file tagged as `@implemented`

## Decisions Made
- **Flat file structure**: Simple for small project, reorganize later if needed
- **Seed data on start**: Easier to demo and test
- **Homepage list**: No routing complexity, single page for now
- **No validation**: Keep scope minimal, add later
- **Soft delete**: Data preserved, can be restored later
