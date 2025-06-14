const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

exports.authCheck = async (req, res, next) => {
  try {
    //code
    const headerToken = req.headers.authorization;
    // console.log('YOYO',headerToken);
    if (!headerToken) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }
    const token = headerToken.split(" ")[1]; // Bearer token

    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode; // Attach user info to request object

    const user = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
    });
    if (!user.enabled) {
      return res.status(404).json({ message: "This account can not access" });
    }

    next();
  } catch (error) {
    //error
    console.log("Something wrong in middleware");
    res.status(500).json({ message: "Token Invalid" });
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    //code
    const { email } = req.user; // Get email from user info attached in authCheck
    const adminUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin Only" });
    }
//    console.log("Admin User", adminUser);
    next();
  } catch (error) {
    //error
    console.log(err);
    res.status(500).json({ message: "Admin access denied" });
  }
};
