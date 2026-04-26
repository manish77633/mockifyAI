const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/adminAuth');
const {
  getStats,
  getUsers,
  banUser,
  deleteUser,
  getEndpoints,
  deleteEndpoint,
  getRevenueStats,
  toggleAdmin
} = require('../controllers/adminController');

router.use(requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:userId/ban', banUser);
router.put('/users/:userId/role', toggleAdmin);
router.delete('/users/:userId', deleteUser);
router.get('/endpoints', getEndpoints);
router.delete('/endpoints/:endpointId', deleteEndpoint);
router.get('/revenue', getRevenueStats);

module.exports = router;
