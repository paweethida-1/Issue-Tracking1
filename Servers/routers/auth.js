const express = require("express");
const router = express.Router();
const { register , login } =require('../controllers/auth');


router.post("/register",register)

router.post("/login",login)


//export
module.exports = router;