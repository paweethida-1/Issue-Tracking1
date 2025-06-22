const express = require('express');
const router = express.Router();
const requestController = require("../controllers/request");
//const { authCheck } = require('../middlewares/auth');


// ผู้ใช้ทั่วไป: สร้างคำร้อง
router.post('/request', requestController.createRequest);

// ผู้ดูแลระบบ: ดูทั้งหมด
router.get('/request', requestController.getAllRequests);

// ดูคำร้องรายตัว
router.get('/request/:id', requestController.getRequestById);

// ผู้ดูแลระบบ: เปลี่ยน priority
router.patch('/request/:id/priority', requestController.updatePriority);

// ผู้ดูแลระบบ: เปลี่ยน status
router.patch('/request/:id/status', requestController.updateStatus);

module.exports = router;