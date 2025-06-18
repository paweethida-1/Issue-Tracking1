const express = require('express');
const router = express.Router();
const requestController = require("../controllers/request");

// ผู้ใช้ทั่วไป: สร้างคำร้อง
router.post('/', requestController.createRequest);

// ผู้ดูแลระบบ: ดูทั้งหมด
router.get('/', requestController.getAllRequests);

// ดูคำร้องรายตัว
router.get('/:id', requestController.getRequestById);

// ผู้ดูแลระบบ: เปลี่ยน priority
router.patch('/:id/priority', requestController.updatePriority);

// ผู้ดูแลระบบ: เปลี่ยน status
router.patch('/:id/status', requestController.updateStatus);


module.exports = router;