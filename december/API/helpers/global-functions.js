const jwt = require("jsonwebtoken");
//authentication function authJWT
global.authJWT = function (req, res, next) {
  console.log("req cookie data", req.cookies.token);
  console.log(typeof req.cookies);
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  jwt.verify(token, config.JWT.secret, function (err, user) {
    if (err) {
      res.redirect("/loginUser");
    } else {
      req.user = user;
      next();
    }
  });
};
