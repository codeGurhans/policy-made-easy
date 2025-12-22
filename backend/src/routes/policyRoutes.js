const express = require('express');
const router = express.Router();
const {
  getAllPolicies,
  getPolicyById,
  checkEligibility
} = require('../controllers/policyController');

// GET all policies with optional filters
router.get('/', getAllPolicies);

// GET policy by ID
router.get('/:id', getPolicyById);

// POST to check eligibility based on user inputs
router.post('/check-eligibility', checkEligibility);

module.exports = router;