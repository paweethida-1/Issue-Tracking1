const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

// 📌 Register
router.post('/register', async (req, res) => {
  console.log('Register endpoint hit with body:', req.body);  // <-- เพิ่มตรงนี้

  const { full_name, email, employee_id, phone_number } = req.body;
  try {
    // ตรวจสอบ email ซ้ำ
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash employee_id
    const hashedEmployeeId = await bcrypt.hash(employee_id, 10);

    // Insert user
    await db.query(
      'INSERT INTO users (full_name, email, employee_id, phone_number) VALUES (?, ?, ?, ?)',
      [full_name, email, hashedEmployeeId, phone_number]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📌 Login
router.post('/login', async (req, res) => {
  console.log('Login endpoint hit with body:', req.body);  // <-- เพิ่มตรงนี้

  const { email, employee_id } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare employee_id
    const isMatch = await bcrypt.compare(employee_id, user.employee_id);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, full_name: user.full_name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
