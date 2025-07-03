// Step 1: Import the express module
const express = require('express');
const app = express();
const morgan = require('morgan');
const authRouter = require('./routes/auth');
const { readdirSync } = require('fs');
const cors = require('cors');


// middleware 
app.use(morgan('dev')); // logging middleware
app.use(express.json()); // parse JSON bodies
app.use(cors()); // enable CORS for all routes

//เพิ่มตรงนี้

// app.use('/api',authRouter); // use authRouter for routes starting with /api
readdirSync('./routes')
.map((file)=> app.use('/api', require('./routes/' + file)) );

//step 3 Router
// app.post('/api',(req,res)=>{

//     const { username,password } = req.body;
//     console.log(username, password);
//     res.send("Hello World eiei");
// })



//step 2 Start Server 
app.listen(5000, 
    () => console.log('Server is running on port 5000'));