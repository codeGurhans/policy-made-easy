const express = require('express');
const router = express.Router();

// Placeholder for user-related routes if needed in the future
// Currently, user data is handled through the policy/check-eligibility endpoint

router.get('/', (req, res) => {
  res.json({ message: 'User routes placeholder' });
});

module.exports = router;