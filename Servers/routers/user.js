const express = require("express");
const router = express.Router();



router.get("/users", (req, res)=> {
    res.send("Hello users");
})




//export
module.exports = router;

