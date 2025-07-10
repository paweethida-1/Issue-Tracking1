const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

// ✅ ตรวจสอบ JWT และแนบ user เข้า req.user
exports.authCheck = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    console.log("Authorization Header:", headerToken);// เพิ่ม log ดู header
    if (!headerToken || !headerToken.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const token = headerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log("Decoded token:", decoded); // ดูข้อมูล decoded

    // ใช้ id จาก decoded payload
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.enabled) {
      return res.status(403).json({ message: "This account cannot access" });
    }

    req.user = {
      userId: user.id,
      name: user.name,
      role: user.role,
    }; // แนบ user object ทั้งตัวไว้ใช้งานถัดไป
    console.log("User attached to req:", req.user);
    next();
  } catch (error) {
    console.error("Something went wrong in authCheck:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(401).json({ message: "Token invalid" });
  }
};

// ✅ ตรวจสอบว่าผู้ใช้เป็น ADMIN หรือ ADMIN_STAFF
exports.adminCheck = async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role !== "ADMIN" && role !== "ADMIN_STAFF") {
      return res.status(403).json({ message: "Access denied: Admin Only" });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error.message);
    res.status(500).json({ message: "Admin access denied" });
  }
};
