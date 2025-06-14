//import.....
const express = require('express');
const router = express.Router();
// Import controllers
const { register, login, currentUser, currentStaff,  } = require('../controllers/auth');

router.post('/register', register);
router.post('/login',login)
router.post('/current-user',currentUser)
router.post('/current-staff',currentUser)
router.post('/current-admin',currentUser)

module.exports = router;