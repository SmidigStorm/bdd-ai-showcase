const crypto = require('crypto');
const organizationRepository = require('./organization-repository');

// In-memory storage
const educations = new Map();

// Seed data - will be initialized after organizations are loaded
let seedData = [];

function initializeSeedData() {
  const orgs = organizationRepository.findAll();
  if (orgs.length === 0) return;

  const universityOrg = orgs.find(o => o.level === 'UNIVERSITY') || orgs[0];
  const collegeOrg = orgs.find(o => o.level === 'COLLEGE') || orgs[0];

  seedData = [
    {
      id: crypto.randomUUID(),
      name: 'Bachelor of Computer Science',
      code: 'BCS-2024',
      level: 'BACHELOR',
      description: 'A comprehensive computer science program',
      organizationId: universityOrg.id,
      deleted: false,
    },
    {
      id: crypto.randomUUID(),
      name: 'Master of Business Administration',
      code: 'MBA-2024',
      level: 'MASTER',
      description: 'Executive MBA program',
      organizationId: universityOrg.id,
      deleted: false,
    },
    {
      id: crypto.randomUUID(),
      name: 'Certificate in Web Development',
      code: 'CWD-2024',
      level: 'CERTIFICATE',
      description: null,
      organizationId: collegeOrg.id,
      deleted: false,
    },
  ];

  seedData.forEach((edu) => educations.set(edu.id, edu));
}

// Initialize seed data
initializeSeedData();

const educationRepository = {
  findAll() {
    return Array.from(educations.values()).filter((edu) => !edu.deleted);
  },

  findById(id) {
    const edu = educations.get(id);
    if (!edu || edu.deleted) return null;
    return edu;
  },

  create({ name, code, level, description = null, organizationId }) {
    const edu = {
      id: crypto.randomUUID(),
      name,
      code,
      level,
      description,
      organizationId,
      deleted: false,
    };
    educations.set(edu.id, edu);
    return edu;
  },

  update(id, updates) {
    const edu = educations.get(id);
    if (!edu || edu.deleted) return null;

    const updated = { ...edu, ...updates, id, deleted: edu.deleted };
    educations.set(id, updated);
    return updated;
  },

  softDelete(id) {
    const edu = educations.get(id);
    if (!edu || edu.deleted) return false;

    edu.deleted = true;
    educations.set(id, edu);
    return true;
  },

  // For testing: reset to seed data
  reset() {
    educations.clear();
    initializeSeedData();
  },
};

module.exports = educationRepository;
