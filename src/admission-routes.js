const express = require('express');
const repository = require('./admission-repository');

const router = express.Router();

// GET /api/admissions - List all admissions
router.get('/', (req, res) => {
  const admissions = repository.findAll();
  res.json(admissions);
});

// GET /api/admissions/:id - Get single admission
router.get('/:id', (req, res) => {
  const adm = repository.findById(req.params.id);
  if (!adm) {
    return res.status(404).end();
  }
  res.json(adm);
});

// POST /api/admissions - Create new admission
router.post('/', (req, res) => {
  const { name, description, applicationOpens, applicationDeadline, organizationId } = req.body;
  if (!name || !applicationOpens || !applicationDeadline || !organizationId) {
    return res.status(400).end();
  }
  const adm = repository.create({ name, description, applicationOpens, applicationDeadline, organizationId });
  res.status(201).json(adm);
});

// PUT /api/admissions/:id - Update admission
router.put('/:id', (req, res) => {
  const adm = repository.update(req.params.id, req.body);
  if (!adm) {
    return res.status(404).end();
  }
  res.json(adm);
});

// DELETE /api/admissions/:id - Soft delete admission
router.delete('/:id', (req, res) => {
  const deleted = repository.softDelete(req.params.id);
  if (!deleted) {
    return res.status(404).end();
  }
  res.status(204).end();
});

module.exports = router;
