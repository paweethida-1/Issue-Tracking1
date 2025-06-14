const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req,res) => {

    try {
        //code

        const { email,password, } = req.body;

        //step 1 Validate body
        if(!email){
            return res.status(400).json({ message: "Email is required"});
        }
        if(!password){
            return res.status(400).json({ message: "Password is required"});
        }

        //step 2 check Email in database already?

        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        }); console.log(user);
        if(user){
            return res.status(400).json({ message: "Email already exists"});
        }

        //step 3 Hash password
        const hashPassword = await bcrypt.hash(password,10);
        

        //step 4 Create user
        await prisma.user.create({

            data: {
                email: email,
                password: hashPassword
            }
        })


        res.send("Registered Successfully"); 
    } catch (error) {
        //error
        console.log(error);
        res.status(500).json({ message: "server error"});
        
    }
}

exports.login = async(req,res)=>{
    try {
        //code
        const { email, password } = req.body;

        if(!email){
            return res.status(400).json({ message: "Email is required"});
        }

        if(!password){
            return res.status(400).json({ message: "Password is required"});
        }

        //step 1 check email 
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if(!user || !user.enabled){
            return res.status(400).json({ message: "User not found or not Enabled"});
        }
        //step 2 check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Password Invalid "});
        }
        //step 3 Create Payload
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        //step 4 Generate Token
        jwt.sign(payload,process.env.SECRET,{ expiresIn: '1d' },(err,token)=>{
            if(err){
                console.log(err);
                return res.status(500).json({ message: "Server Error"});
            }
            //step 5 Send response
            res.json({ payload, token });
        })
    } catch (error) {
        //error
        console.log(error);
        res.status(500).json({ message: "server error"});
        
    }

}

exports.currentUser = async(req,res)=>{

    try {
        //code
        res.send("Hello User currentUser Controller");
    } catch (error) {
        //error
        console.log(error);
        res.status(500).json({ message: "server error"});
    }
}





