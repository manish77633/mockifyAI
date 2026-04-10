const express = require('express');
const router = express.Router();
const { serveMockData } = require('../controllers/endpointController');

// GET /api/mock/:username/:endpointName
// Public route — serves the mock JSON for a given user's endpoint
router.get('/:username/:endpointName(*)', serveMockData);

module.exports = router;
