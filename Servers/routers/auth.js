const express = require("express");
const router = express.Router();



router.get("/register", (req, res) => {
    res.send("Hello register");
})
router.get("/login", (req, res)=> {
    res.send("Hello login");
})




//export
module.exports = router;