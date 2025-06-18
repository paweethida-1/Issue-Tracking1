
exports.register = (req, res) => {
    const { email , password} = req.body;
    console.log(email, password);
    res.send("Hello Create Register");
};



exports.login = (req, res) => {
    res.send("Hello Create Login")
};