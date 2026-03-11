const express = require('express');
const router  = express.Router();

const { protect } = require('../middleware/auth');
const {
  createEndpointModeA,
  createEndpointModeB,
  serveMockData,
  updateEndpoint,
  deleteEndpoint,
  listEndpoints,
} = require('../controllers/endpointController');

// ─────────────────────────────────────────────────────────────────────────────
// Protected Endpoint Management Routes  (all require a valid JWT)
// Base: /api/endpoints
// ─────────────────────────────────────────────────────────────────────────────

// GET    /api/endpoints            → list caller's endpoints (paginated)
router.get('/', protect, listEndpoints);

// POST   /api/endpoints/generate   → Mode A: AI-generated mock
// NOTE: the aiGeneratorLimiter is applied in server.js BEFORE this router mounts
router.post('/generate', protect, createEndpointModeA);

// POST   /api/endpoints/manual     → Mode B: paste raw JSON
router.post('/manual', protect, createEndpointModeB);

// PUT    /api/endpoints/:id        → update payload / rename slug
router.put('/:id', protect, updateEndpoint);

// DELETE /api/endpoints/:id        → delete an endpoint
router.delete('/:id', protect, deleteEndpoint);

// ─────────────────────────────────────────────────────────────────────────────
// Public Dynamic Mock-Serve Route
// GET /api/:username/:endpointName
// Rate-limited at server.js level (60 req/min/IP via mockFetchLimiter).
// MUST be registered in server.js AFTER /api/endpoints to avoid shadowing.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:username/:endpointName(*)', serveMockData);

module.exports = router;
