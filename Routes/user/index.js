const express = require("express");
const router = express.Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const { userAuthentication } = require("../../Models/user/index");
const {
  signinValidation,
  catchValidationErrors,
} = require("../../validation/user.validation");
const { userAuthorization } = require("./middleware");
const { weeklyReports } = require("../../reports/index");

router.post(
  "/signin",
  signinValidation,
  catchValidationErrors,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userAuthentication(email, password);
      if (user) {
        await weeklyReports(user.lastReported, user._id, user.createDate);
        const token = jwt.sign({ id: user._id }, config.get("secret"));
        res.cookie("token", token);
        res.status(200).json({ message: "Success" });
      } else {
        res.status(401).json({ message: "email or password in incorrect" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);
router.get("/signout", userAuthorization, (req, res) => {
  try {
    res.clearCookie("token");
    res.status(201).json({ message: "Success" });
  } catch (error) {
    res.status().json({ message: "Error" });
  }
});

module.exports = router;
