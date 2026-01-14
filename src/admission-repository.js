const crypto = require('crypto');
const organizationRepository = require('./organization-repository');

// In-memory storage
const admissions = new Map();

// Seed data - will be initialized after organizations are loaded
let seedData = [];

function initializeSeedData() {
  const orgs = organizationRepository.findAll();
  if (orgs.length === 0) return;

  const universityOrg = orgs.find(o => o.level === 'UNIVERSITY') || orgs[0];

  seedData = [
    {
      id: crypto.randomUUID(),
      name: 'UHG 2025',
      description: 'Bachelor admissions for 2025',
      applicationOpens: '2025-01-15T00:00:00Z',
      applicationDeadline: '2025-04-15T23:59:59Z',
      status: 'PLANNED',
      organizationId: universityOrg.id,
      deleted: false,
    },
    {
      id: crypto.randomUUID(),
      name: 'Local Admission 2025',
      description: null,
      applicationOpens: '2025-02-01T00:00:00Z',
      applicationDeadline: '2025-03-01T23:59:59Z',
      status: 'PLANNED',
      organizationId: universityOrg.id,
      deleted: false,
    },
  ];

  seedData.forEach((adm) => admissions.set(adm.id, adm));
}

// Initialize seed data
initializeSeedData();

const admissionRepository = {
  findAll() {
    return Array.from(admissions.values()).filter((adm) => !adm.deleted);
  },

  findById(id) {
    const adm = admissions.get(id);
    if (!adm || adm.deleted) return null;
    return adm;
  },

  create({ name, description = null, applicationOpens, applicationDeadline, organizationId, status = 'PLANNED' }) {
    const adm = {
      id: crypto.randomUUID(),
      name,
      description,
      applicationOpens,
      applicationDeadline,
      status,
      organizationId,
      deleted: false,
    };
    admissions.set(adm.id, adm);
    return adm;
  },

  update(id, updates) {
    const adm = admissions.get(id);
    if (!adm || adm.deleted) return null;

    const updated = { ...adm, ...updates, id, deleted: adm.deleted };
    admissions.set(id, updated);
    return updated;
  },

  softDelete(id) {
    const adm = admissions.get(id);
    if (!adm || adm.deleted) return false;

    adm.deleted = true;
    admissions.set(id, adm);
    return true;
  },

  // For testing: reset to seed data
  reset() {
    admissions.clear();
    initializeSeedData();
  },
};

module.exports = admissionRepository;
