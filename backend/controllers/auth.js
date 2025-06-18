const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, department, employeeId, email, password } = req.body;

    // Validate required fields
    if (!name || !department || !employeeId || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role USER by default
    await prisma.user.create({
      data: {
        name,
        department,
        employeeId,
        email,
        password: hashedPassword,
        role: 'USER'  // 👈 fixed value
      }
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login body:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("Found user:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // ✅ ตรงนี้
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });
    res.json({ payload, token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.currentUser = async (req, res) => {
  try {
    res.send("Hello User currentUser Controller");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};





