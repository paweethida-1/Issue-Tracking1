const express = require('express');
const router = express.Router();

// controllers
const { list, update, remove, changeStatus, changeRole } = require('../controllers/users');
// middlewares
const { authCheck, adminCheck } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck'); // ✅ เพิ่ม

// ✅ อนุญาต ADMIN, ADMIN_STAFF, STAFF
router.get('/users', authCheck, requireRole(['ADMIN', 'ADMIN_STAFF', 'STAFF']), list);

// เฉพาะ ADMIN เท่านั้น
router.patch('/users/:userId', authCheck, adminCheck, update);
router.delete('/users/:userId', authCheck, adminCheck, remove);
router.patch('/:userId/role', authCheck, adminCheck, changeRole);
router.patch('/:userId/status', authCheck, adminCheck, changeStatus);

module.exports = router;
