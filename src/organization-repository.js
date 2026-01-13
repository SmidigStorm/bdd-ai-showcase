const crypto = require('crypto');

// In-memory storage
const organizations = new Map();

// Seed data
const seedData = [
  {
    id: crypto.randomUUID(),
    name: 'Springfield University',
    level: 'UNIVERSITY',
    category: 'LIBERAL_ARTS',
    description: 'A leading liberal arts institution',
    deleted: false,
  },
  {
    id: crypto.randomUUID(),
    name: 'Tech Valley College',
    level: 'COLLEGE',
    category: 'TECHNICAL',
    description: 'Hands-on technical education',
    deleted: false,
  },
  {
    id: crypto.randomUUID(),
    name: 'Westside High School',
    level: 'HIGH_SCHOOL',
    category: 'VOCATIONAL',
    description: null,
    deleted: false,
  },
];

// Initialize with seed data
seedData.forEach((org) => organizations.set(org.id, org));

const organizationRepository = {
  findAll() {
    return Array.from(organizations.values()).filter((org) => !org.deleted);
  },

  findById(id) {
    const org = organizations.get(id);
    if (!org || org.deleted) return null;
    return org;
  },

  create({ name, level, category, description = null }) {
    const org = {
      id: crypto.randomUUID(),
      name,
      level,
      category,
      description,
      deleted: false,
    };
    organizations.set(org.id, org);
    return org;
  },

  update(id, updates) {
    const org = organizations.get(id);
    if (!org || org.deleted) return null;

    const updated = { ...org, ...updates, id, deleted: org.deleted };
    organizations.set(id, updated);
    return updated;
  },

  softDelete(id) {
    const org = organizations.get(id);
    if (!org || org.deleted) return false;

    org.deleted = true;
    organizations.set(id, org);
    return true;
  },

  // For testing: reset to seed data
  reset() {
    organizations.clear();
    seedData.forEach((org) => {
      const copy = { ...org, id: crypto.randomUUID(), deleted: false };
      organizations.set(copy.id, copy);
    });
  },
};

module.exports = organizationRepository;
