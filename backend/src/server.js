const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT =  3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));

// Import routes
const policyRoutes = require('./routes/policyRoutes');
const userRoutes = require('./routes/userRoutes');

// API routes
app.use('/api/policies', policyRoutes);
app.use('/api/users', userRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.get('/policies', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/policies.html'));
});

app.get('/policy/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/policy-detail.html'));
});

app.get('/questionnaire', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/questionnaire.html'));
});

app.get('/results', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/results.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/about.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../../frontend/404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`PolicyLens India server running on port ${PORT}`);
});

module.exports = app;