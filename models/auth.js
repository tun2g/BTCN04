const jwt = require("jsonwebtoken")
const authenToken=function(req, res, next) {
    // 'Beaer [token]'
    const token = req.cookies.token
    if (!token) res.redirect("http://localhost:3113/auth/login");
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) {
          res.redirect("http://localhost:3113/auth/login")
      }
      next(err)
    });
  }
  module.exports=authenToken