const db = require('../models/db');

// Get all policies
const getAllPolicies = (req, res) => {
  const { category, targetGroup, status, search } = req.query;
  
  let query = 'SELECT * FROM policies WHERE 1=1';
  let params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (targetGroup) {
    query += ' AND target_group = ?';
    params.push(targetGroup);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Parse JSON fields
    const policies = rows.map(row => ({
      ...row,
      pros: JSON.parse(row.pros),
      cons: JSON.parse(row.cons),
      eligibility_rules: JSON.parse(row.eligibility_rules),
      official_links: JSON.parse(row.official_links)
    }));

    res.json(policies);
  });
};

// Get policy by ID
const getPolicyById = (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM policies WHERE id = ?',
    [id],
    (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!row) {
        return res.status(404).json({ error: 'Policy not found' });
      }

      // Parse JSON fields
      const policy = {
        ...row,
        pros: JSON.parse(row.pros),
        cons: JSON.parse(row.cons),
        eligibility_rules: JSON.parse(row.eligibility_rules),
        official_links: JSON.parse(row.official_links)
      };

      res.json(policy);
    }
  );
};

// Check eligibility for user questionnaire
const checkEligibility = (req, res) => {
  const { age_range, occupation, income_range, student_status, state, family_income } = req.body;

  // Save user data temporarily (for analytics, not personal identification)
  const insertUserQuery = `
    INSERT INTO users (age_range, occupation, income_range, student_status, state, family_income)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(insertUserQuery, [age_range, occupation, income_range, student_status, state, family_income], function(err) {
    if (err) {
      console.error('Error saving user data:', err.message);
    }
  });

  // Query to find matching policies based on eligibility rules
  const query = 'SELECT * FROM policies';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Parse JSON fields
    const policies = rows.map(row => ({
      ...row,
      pros: JSON.parse(row.pros),
      cons: JSON.parse(row.cons),
      eligibility_rules: JSON.parse(row.eligibility_rules),
      official_links: JSON.parse(row.official_links)
    }));

    // Filter policies based on eligibility rules
    const eligiblePolicies = policies.filter(policy => {
      const rules = policy.eligibility_rules;
      
      // Simple rule matching - this could be expanded based on complexity
      if (rules.student !== undefined) {
        if (rules.student !== (student_status === 'yes')) {
          return false;
        }
      }
      
      if (rules.age_min !== undefined) {
        const minAge = parseInt(age_range.split('-')[0]);
        if (minAge < rules.age_min) {
          return false;
        }
      }
      
      if (rules.age_max !== undefined) {
        const maxAge = parseInt(age_range.split('-')[1]) || 100;
        if (maxAge > rules.age_max) {
          return false;
        }
      }
      
      if (rules.income_max !== undefined) {
        // Convert income range to comparable value
        let incomeValue = 0;
        if (income_range === 'below-2-lakh') incomeValue = 200000;
        else if (income_range === '2-5-lakh') incomeValue = 350000;
        else if (income_range === '5-10-lakh') incomeValue = 750000;
        else if (income_range === 'above-10-lakh') incomeValue = 1200000;
        
        if (incomeValue > rules.income_max) {
          return false;
        }
      }
      
      // Add more rule matching logic here as needed
      return true;
    });

    res.json({
      user_profile: { age_range, occupation, income_range, student_status, state, family_income },
      eligible_policies: eligiblePolicies,
      total_eligible: eligiblePolicies.length
    });
  });
};

module.exports = {
  getAllPolicies,
  getPolicyById,
  checkEligibility
};