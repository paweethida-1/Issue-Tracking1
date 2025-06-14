const express = require('express');
const router = express.Router();

// controllers
const { list, update, remove, changeStatus, changeRole } = require('../controllers/users');
// middlewares
const { authCheck, adminCheck } = require('../middleware/auth');

router.get('/users', authCheck, adminCheck, list);
router.patch('/users/:userId', authCheck, adminCheck, update);
router.delete('/users/:userId', authCheck, adminCheck, remove);
// router.post('/Change-status',changeStatus, authCheck, adminCheck,);
// router.post('/Change-role',changeRole, authCheck, adminCheck,);

module.exports = router;