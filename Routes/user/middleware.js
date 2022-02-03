const config = require("config");
const jwt = require("jsonwebtoken");
const { getUserById } = require("../../Models/user/index");
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
function getUserIdFromToken(token) {
  let userId = jwt.verify(token, config.get("secret")).id;
  return userId;
}
async function userRoleAuth(signedInId, userId) {
  if (signedInId === userId) {
    return true;
  }
  const signedInUser = await getUserById(signedInId);
  const user = await getUserById(userId);
  if (signedInUser.role === "Admin") {
    return true;
  } else if (signedInUser.role === "User Manager" && user.role !== "Admin") {
    return true;
  }
  return false;
}
module.exports = { userAuthorization, getUserIdFromToken, userRoleAuth };
