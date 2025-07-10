const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

// ดึง user ทั้งหมด
exports.list = async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// อัปเดตข้อมูล user (name, email, department, password (ถ้ามี))
exports.update = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, department, password } = req.body;

    const dataToUpdate = { name, email, department };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: dataToUpdate,
    });

    res.json({ message: "Update success", updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ลบ user
exports.remove = async (req, res) => {
  try {
    const { userId } = req.params;
    await prisma.user.delete({
      where: { id: Number(userId) },
    });

    res.status(200).json({ message: "Deleted success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// เปลี่ยนสถานะ enabled/disabled
exports.changeStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { enabled } = req.body;  // ควรใช้ enabled ตาม frontend

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { enabled },
    });

    res.status(200).json({ message: "Change-Status success", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// เปลี่ยน role
exports.changeRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { role },
    });

    res.status(200).json({ message: "Change-Role success", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


