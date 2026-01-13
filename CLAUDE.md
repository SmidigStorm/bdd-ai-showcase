# BDD AI Showcase - Development Guide

This is a demo app showcasing AI-assisted BDD development. It uses Express.js with vanilla HTML/JS frontend and Playwright-BDD for testing.

## Quick Commands

```bash
npm start          # Start server on http://localhost:3000
npm test           # Generate BDD tests and run all tests
npx bddgen         # Generate test files from .feature files
```

## Project Structure

```
src/
  server.js                 # Express server entry point
  public/index.html         # Frontend UI
  *-repository.js           # In-memory data storage (pattern: entity-repository.js)
  *-routes.js               # API routes (pattern: entity-routes.js)

tests/steps/
  *.js                      # Step definitions (one file per entity/domain)

docs/
  strategy/
    vision.md               # Product vision
    tech-stack.md           # Technology decisions
    backlog.md              # Prioritized backlog
  domains/
    {domain}/entities/*.md  # Entity documentation
  requirements/
    registry.md             # All requirement IDs
    {domain}/{subdomain}/{capability}/*.feature  # Gherkin feature files
  plans/
    *.md                    # Implementation plans
```

## Development Workflow

### Adding a New Feature

1. **Document the entity** in `docs/domains/{domain}/entities/{entity}.md`
2. **Create feature files** in `docs/requirements/`:
   - `{entity}.feature` - E2E browser tests (user interactions)
   - `{entity}-api.feature` - API integration tests
3. **Register requirements** in `docs/requirements/registry.md`
4. **Implement backend**: repository + routes in `src/`
5. **Add UI** to `src/public/index.html`
6. **Write step definitions** in `tests/steps/{entity}.js`
7. **Run tests**: `npm test`

### Feature File Conventions

- Tag files with requirement ID: `@ENT-CAP-001`
- Tag implemented scenarios: `@implemented`
- Use vivid, concrete examples (real names like "Harvard University", not "Test Org")
- Separate E2E (browser) and API tests into different files

Example E2E feature:
```gherkin
@ORG-MNG-001
Feature: Organization Management

  @implemented
  Scenario: Create a new organization
    Given I am on the homepage
    When I click the Add Organization button
    And I fill in "Harvard University" as the name
    And I click Save
    Then I should see "Harvard University" in the list
```

Example API feature:
```gherkin
@ORG-MNG-002
Feature: Organization API

  Background:
    Given I am logged in as an admin

  @implemented
  Scenario: Create a new organization
    When I create an organization with:
      | name     | Stanford University |
      | level    | UNIVERSITY          |
      | category | RESEARCH            |
    Then the organization should be created successfully
```

### Step Definition Patterns

All steps for an entity go in one file (`tests/steps/{entity}.js`).

**Test Isolation**: Each test gets unique data via timestamps:
```javascript
let testId;
let createdEntities = new Map();  // Store by original name

function uniqueName(name) {
  return `${name} ${testId}`;
}

// Initialize in setup step
Given('I am on the homepage', async ({ page }) => {
  testId = Date.now().toString();
  createdEntities.clear();
  await page.goto('/');
});
```

**Storing test data**: Use original name as key, store object with id and uniqueName:
```javascript
createdEntities.set(name, { id: org.id, uniqueName: uName, ...org });
```

**Shared steps** that work for both API and E2E:
```javascript
Given('an organization {string} exists', async ({ page, request }, name) => {
  const uName = uniqueName(name);
  const response = await request.post('/api/organizations', {
    data: { name: uName, level: 'UNIVERSITY', category: 'LIBERAL_ARTS' }
  });
  const org = await response.json();
  createdEntities.set(name, { id: org.id, uniqueName: uName, ...org });
  if (page) await page.reload();  // Reload if E2E context
});
```

**E2E browser steps**: Use simple selectors with IDs:
```javascript
When('I click the Add button', async ({ page }) => {
  await page.locator('#add-btn').click();
});

Then('I should see {string} in the list', async ({ page }, name) => {
  const entity = createdEntities.get(name);
  await expect(page.locator('#list')).toContainText(entity.uniqueName);
});
```

### HTML UI Pattern

Use data attributes for test targeting:
```html
<table id="organizations-list">
  <tr data-id="${org.id}">
    <td>${org.name}</td>
    <td>
      <button onclick="editOrg('${org.id}')">Edit</button>
      <button onclick="deleteOrg('${org.id}')">Delete</button>
    </td>
  </tr>
</table>
```

Selector pattern for row-specific actions:
```javascript
await page.locator(`tr[data-id="${id}"] button`).filter({ hasText: 'Edit' }).click();
```

### Repository Pattern

```javascript
// src/{entity}-repository.js
const { v4: uuidv4 } = require('uuid');

const entities = new Map();

// Seed data
entities.set('seed-id', { id: 'seed-id', name: 'Seed Entity' });

module.exports = {
  findAll: () => Array.from(entities.values()),
  findById: (id) => entities.get(id),
  create: (data) => {
    const entity = { id: uuidv4(), ...data };
    entities.set(entity.id, entity);
    return entity;
  },
  update: (id, data) => {
    const entity = entities.get(id);
    if (!entity) return null;
    const updated = { ...entity, ...data };
    entities.set(id, updated);
    return updated;
  },
  delete: (id) => entities.delete(id),
};
```

### Routes Pattern

```javascript
// src/{entity}-routes.js
const express = require('express');
const repository = require('./{entity}-repository');

const router = express.Router();

router.get('/', (req, res) => res.json(repository.findAll()));
router.get('/:id', (req, res) => {
  const entity = repository.findById(req.params.id);
  if (!entity) return res.status(404).json({ error: 'Not found' });
  res.json(entity);
});
router.post('/', (req, res) => res.status(201).json(repository.create(req.body)));
router.put('/:id', (req, res) => {
  const entity = repository.update(req.params.id, req.body);
  if (!entity) return res.status(404).json({ error: 'Not found' });
  res.json(entity);
});
router.delete('/:id', (req, res) => {
  repository.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
```

Mount in server.js:
```javascript
app.use('/api/{entities}', require('./{entity}-routes'));
```

## Requirement ID Convention

Format: `{DOMAIN}-{CAPABILITY}-{NUMBER}`

- Domain: 3-letter code (ORG, EDU, ADM)
- Capability: 3-letter code (MNG, API, RPT)
- Number: 3-digit sequential (001, 002)

Examples:
- `ORG-MNG-001` - Organization Management E2E
- `ORG-MNG-002` - Organization API
- `EDU-MNG-001` - Education Management

## Testing Tips

- Keep timeout short (5s in playwright.config.js) for fast feedback
- Use simple `#id` selectors, not complex `getByRole` queries
- Each test creates its own data - no shared state between tests
- API tests use `{ request }`, E2E tests use `{ page }`
- Run `npm test` frequently during development

## Available Plugins

Use slash commands for guided workflows:
- `/pm-vision:vision` - Create/update product vision
- `/pm-architecture:architecture` - Manage tech stack decisions
- `/pm-domain-knowledge:domain` - Document entities and processes
- `/pm-requirements:requirements` - Generate BDD feature files
- `/pm-prioritization:backlog` - Manage product backlog
- `/pm-planning:plan` - Create implementation plans
- `/pm-planning:execute` - Execute a plan step by step
