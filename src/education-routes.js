const express = require('express');
const repository = require('./education-repository');

const router = express.Router();

// GET /api/educations - List all educations
router.get('/', (req, res) => {
  const educations = repository.findAll();
  res.json(educations);
});

// GET /api/educations/:id - Get single education
router.get('/:id', (req, res) => {
  const edu = repository.findById(req.params.id);
  if (!edu) {
    return res.status(404).end();
  }
  res.json(edu);
});

// POST /api/educations - Create new education
router.post('/', (req, res) => {
  const { name, code, level, description, organizationId } = req.body;
  if (!name || !code || !level || !organizationId) {
    return res.status(400).end();
  }
  const edu = repository.create({ name, code, level, description, organizationId });
  res.status(201).json(edu);
});

// PUT /api/educations/:id - Update education
router.put('/:id', (req, res) => {
  const edu = repository.update(req.params.id, req.body);
  if (!edu) {
    return res.status(404).end();
  }
  res.json(edu);
});

// DELETE /api/educations/:id - Soft delete education
router.delete('/:id', (req, res) => {
  const deleted = repository.softDelete(req.params.id);
  if (!deleted) {
    return res.status(404).end();
  }
  res.status(204).end();
});

module.exports = router;
