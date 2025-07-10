const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ สมัครสมาชิก
exports.register = async (req, res) => {
  try {
    const { name, department, employeeId, email, password } = req.body;

    if (!name || !department || !employeeId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        department,
        employeeId,
        email,
        password: hashedPassword,
        role: 'USER', // กำหนด role USER เป็นค่าเริ่มต้น
      },
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ เข้าสู่ระบบ
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!user.enabled) {
      return res.status(403).json({ message: "This account has been disabled" });
    }

    // ✅ เปลี่ยน payload เป็น id และ role
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ ใช้สำหรับตรวจสอบ token แล้วดึง user ปัจจุบัน (optional route)
exports.currentUser = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error("Current user error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
