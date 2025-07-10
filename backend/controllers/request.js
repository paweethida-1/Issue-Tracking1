const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ สร้างคำร้องใหม่
exports.createRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      serviceType,
      requestDate,
      imageUrl,
    } = req.body;

    const request = await prisma.serviceRequest.create({
      data: {
        title,
        description,
        department,
        serviceType,
        requestDate: new Date(requestDate),
        imageUrl,
        userId: req.user.userId,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to create request", details: error.message });
  }
};

// ✅ ดึงคำร้องทั้งหมด (admin)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// ✅ ดึงคำร้องเดียว (by ID) ไปใช้ในหน้าส่วนของ admin และ staff ในการดูรายละเอียดคำร้องของ user
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const request = await prisma.serviceRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,               // ผู้แจ้ง
        assignedTo: true,         // ผู้รับงาน
        team: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
      },
    });

    if (!request) return res.status(404).json({ error: "Request not found" });

    // ✅ จำกัดการเข้าถึง
    if (
      userRole !== "ADMIN" &&
      userRole !== "ADMIN_STAFF" &&
      request.userId !== userId &&
      request.assignedToId !== userId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(request);
  } catch (error) {
    console.error("❌ Error fetching request by ID:", error);
    res.status(500).json({ error: "Failed to fetch request" });
  }
};



// ✅ แก้ไข priority (admin)
// อัปเดต priority และ assigned staff (admin)
// ✅ แอดมินอนุมัติคำร้อง และกำหนด priority + staff
exports.approveRequestAndAssignStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority, staffId } = req.body;
    const adminId = req.user.userId;

    // ✅ ตรวจสอบ input
    if (!priority || !staffId) {
      return res.status(400).json({ error: "priority และ staffId จำเป็นต้องระบุ" });
    }

    // ✅ ตรวจสอบว่า staffId มีอยู่จริง และมี role เป็น STAFF หรือ ADMIN_STAFF
    const staff = await prisma.user.findUnique({
      where: { id: staffId },
    });

    if (!staff || !["STAFF", "ADMIN_STAFF"].includes(staff.role)) {
      return res.status(400).json({ error: "ต้องมอบหมายให้ผู้ที่มี role เป็น STAFF หรือ ADMIN_STAFF เท่านั้น" });
    }

    // ✅ อัปเดตคำร้อง
    const updated = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: {
        priority,
        assignedToId: staffId,
        status: "APPROVED",
      },
      include: {
        assignedTo: true,
        user: true,
      },
    });

    // ✅ บันทึก log การอนุมัติ
    await prisma.statusLog.create({
      data: {
        status: "APPROVED",
        serviceRequestId: updated.id,
        actionById: adminId,
      },
    });

    // ✅ ส่งผลลัพธ์กลับ
    res.json({
      message: "Request approved and assigned to staff successfully",
      request: updated,
    });
  } catch (error) {
    console.error("❌ Failed to approve:", error);
    res.status(500).json({ error: "Failed to approve and assign request" });
  }
};

// เพิ่มทีมสมาชิกในคำร้อง
exports.addTeamMembers = async (req, res) => {
  try {
    const { id } = req.params; // requestId
    const { members } = req.body;

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: "Members array is required" });
    }

    await prisma.teamMember.createMany({
      data: members.map((m) => ({
        requestId: parseInt(id),
        userId: m.userId,
        role: m.role,
      })),
      skipDuplicates: true,
    });

    // อัปเดต assignedToId และสถานะ
    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: {
        assignedToId: req.user.userId,
        status: "IN_PROGRESS",
      },
      include: {
        user: true,
        assignedTo: true,
        team: { // หรือ teamMembers ตาม schema จริง
          include: { user: true },
        },
      },
    });

    // สร้าง log สถานะ
    await prisma.statusLog.create({
      data: {
        status: "IN_PROGRESS",
        serviceRequestId: updatedRequest.id,
        actionById: req.user.userId,
      },
    });

    res.json({
      message: "Team members added successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add team members" });
  }
};


exports.completeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { details, completedImageUrl } = req.body;

    const updated = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: {
        details,
        completedImageUrl,
        status: "COMPLETED",
      },
      include: {
        user: true,
        assignedTo: true,
        team: {
          include: { user: true },
        },
      },
    });

    // สร้าง log สถานะ
    await prisma.statusLog.create({
      data: {
        status: "COMPLETED",
        serviceRequestId: updated.id,
        actionById: req.user.userId,
      },
    });

    res.json({ message: "Request completed", request: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to complete request" });
  }
};


// ปฏิเสธคำร้อง
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.userId;

    const updated = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: {
        status: "REJECTED",
      },
    });

    await prisma.statusLog.create({
      data: {
        status: "REJECTED",
        serviceRequestId: updated.id,
        actionById: adminId,
      },
    });

    res.json({ message: "Request rejected", request: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reject request" });
  }
};

// ดึงสถานะทั้งหมดของคำร้อง
exports.getStatusLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await prisma.statusLog.findMany({
      where: { serviceRequestId: parseInt(id) },
      include: {
        actionBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { timestamp: "asc" },
    });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch status logs" });
  }
};

// controllers/request.js

// ✅ ดึงคำร้องที่ assigned ให้ staff คนนี้
exports.getRequestsAssignedToStaff = async (req, res) => {
  try {
    const staffId = req.user.userId;

    if (!staffId) {
      return res.status(400).json({ error: "Missing staff ID" });
    }

    const requests = await prisma.serviceRequest.findMany({
      where: { assignedToId: staffId },
      include: {
        assignedTo: { select: { name: true } }, // 👈 ดึงชื่อผู้รับผิดชอบ
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(requests);
  } catch (error) {
    console.error("Failed to fetch requests assigned to staff:", error);
    res.status(500).json({ error: "Failed to fetch assigned requests" });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await prisma.serviceRequest.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        user: true, // ✅ เพิ่มเพื่อเอาชื่อผู้แจ้ง
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(requests);
  } catch (error) {
    console.error("Failed to get my requests:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMyRequestsAdmin = async (req, res) => {
  try {
    const userId = req.user.userId; // userId จาก middleware authCheck (แนะนำใช้จาก token ดีกว่าไม่ต้องรับ query param)
    // หรือ ถ้าอยากรับ query param จาก url ก็ใช้ req.query.userId

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const requests = await prisma.serviceRequest.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: { requestDate: "desc" },
    });

    res.json(requests);
  } catch (error) {
    console.error("Failed to get my requests:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// controllers/request.js
exports.updateAssignment = async (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const { priority, staffId } = req.body;

    if (!priority || !staffId) {
      return res.status(400).json({ error: "Priority และ staffId ต้องระบุ" });
    }

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        priority,
        assignedToId: staffId,
      },
      include: {
        user: true,
        assignedTo: true,
      },
    });

    return res.json({ request: updatedRequest });
  } catch (error) {
    console.error("Error in updateAssignment:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

// controllers/requestController.js
exports.deleteRequest = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    // ตรวจสิทธิ์
    if (user.role !== "ADMIN" && user.role !== "ADMIN_STAFF") {
      return res.status(403).json({ error: "Permission denied" });
    }

    // 1. ลบ logs ที่เกี่ยวข้องกับ request นี้
    await prisma.statusLog.deleteMany({
      where: {
        serviceRequestId: Number(id),
      },
    });

    // 2. ลบ team ที่เกี่ยวข้อง
    await prisma.teamMember.deleteMany({
      where: {
        requestId: Number(id),
      },
    });

    // 3. ลบตัว request
    await prisma.serviceRequest.delete({
      where: {
        id: Number(id),
      },
    });

    return res.json({ message: "Request deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบคำร้อง" });
  }
};

// routes/users.js หรือ controller
exports.getStaffUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [{ role: "STAFF" }, { role: "ADMIN_STAFF" }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching staff users:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงรายชื่อ staff" });
  }
};
