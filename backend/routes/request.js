const express = require('express');
const router = express.Router();
const requestController = require("../controllers/request");
const { authCheck, adminCheck } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');


// ดึงคำร้องที่ user (user,admin,staff) สร้าง
router.get("/request/my-requests", authCheck,  requestController.getMyRequests);

// สร้างคำร้อง (POST /api/request)
router.post('/request', authCheck, requestController.createRequest);

// ดึงคำร้องทั้งหมด (admin) (GET /api/request)
router.get('/request', authCheck, adminCheck, requestController.getAllRequests);

// ดึงคำร้องที่ staff รับผิดชอบ (GET /api/request/assigned)
router.get('/request/assigned', authCheck, requireRole(['STAFF', 'ADMIN_STAFF']), requestController.getRequestsAssignedToStaff);

// ดึงคำร้องรายตัว (GET /api/request/:id)
router.get('/request/:id', authCheck, requestController.getRequestById);

// อนุมัติคำร้อง + มอบหมาย staff (admin) (PATCH /api/request/:id/approve)
router.patch('/request/:id/approve', authCheck, adminCheck, requestController.approveRequestAndAssignStaff);

// ปฏิเสธคำร้อง (admin) (PATCH /api/request/:id/reject)
router.patch('/request/:id/reject', authCheck, adminCheck, requestController.rejectRequest);

// ดู log สถานะของคำร้อง (GET /api/request/:id/logs)
router.get('/request/:id/logs', authCheck, requestController.getStatusLogs);

// เพิ่มทีมของ staff (POST /api/request/:id/team)
router.post('/request/:id/team', authCheck, requireRole(['STAFF', 'ADMIN_STAFF']), requestController.addTeamMembers);

// จบงาน (PATCH /api/request/:id/complete)
router.patch('/request/:id/complete', authCheck, requireRole(['STAFF', 'ADMIN_STAFF']), requestController.completeRequest);

// ✅ ดึงคำร้องที่ user/admin สร้างเอง
router.get("/request/my-requests", authCheck, requestController.getMyRequests);

router.get("/users/staff", authCheck, requestController.getStaffUsers);


router.patch('/request/:id/update-assignment', authCheck, requireRole(['ADMIN', 'ADMIN_STAFF']), requestController.updateAssignment);
router.delete('/request/:id', authCheck, adminCheck, requestController.deleteRequest);


module.exports = router;
