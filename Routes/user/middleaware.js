const config = require("config");
const jwt = require("jsonwebtoken");
const userAuthorization = (req, res, next) => {
  let token = req.cookies["token"];
  if (token) {
    let authorizied = jwt.verify(token, config.get("secret"));
    if (!authorizied) {
      res.status(401).json({ message: "User not authorizied" });
    } else {
      next();
    }
  } else {
    res.status(401).json({ message: "User not authorizied" });
  }
};
module.exports = { userAuthorization };