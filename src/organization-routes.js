const express = require('express');
const repository = require('./organization-repository');

const router = express.Router();

// GET /api/organizations - List all organizations
router.get('/', (req, res) => {
  const organizations = repository.findAll();
  res.json(organizations);
});

// GET /api/organizations/:id - Get single organization
router.get('/:id', (req, res) => {
  const org = repository.findById(req.params.id);
  if (!org) {
    return res.status(404).end();
  }
  res.json(org);
});

// POST /api/organizations - Create new organization
router.post('/', (req, res) => {
  const { name, level, category, description } = req.body;
  if (!name || !level || !category) {
    return res.status(400).end();
  }
  const org = repository.create({ name, level, category, description });
  res.status(201).json(org);
});

// PUT /api/organizations/:id - Update organization
router.put('/:id', (req, res) => {
  const org = repository.update(req.params.id, req.body);
  if (!org) {
    return res.status(404).end();
  }
  res.json(org);
});

// DELETE /api/organizations/:id - Soft delete organization
router.delete('/:id', (req, res) => {
  const deleted = repository.softDelete(req.params.id);
  if (!deleted) {
    return res.status(404).end();
  }
  res.status(204).end();
});

module.exports = router;
