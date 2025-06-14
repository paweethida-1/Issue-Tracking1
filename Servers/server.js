
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
// const authRouter = require("./routers/auth");
const { readdirSync } = require('fs');
const cors = require("cors");

//midleware
app.use (morgan ("dev"));
app.use(bodyParser.json());
app.use (cors())

//router
readdirSync('./routers')
.map((item)=> app.use('/api',require('./routers/'+item)));


app.listen(3000,() =>console.log('Server is running on port 3000 รันพอร์ต3000เด้อจร้') )
