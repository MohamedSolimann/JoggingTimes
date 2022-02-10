const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  getUsers,
} = require("../../Models/user/index");
const {
  signupValidation,
  catchValidationErrors,
} = require("../../validation/user.validation");
const { userAuthorization, getUserIdFromToken } = require("./middleware");

router.post("/", signupValidation, catchValidationErrors, async (req, res) => {
  const user = req.body;
  try {
    const newUser = await createUser(user);
    res.status(201).json({ message: "Success", data: newUser });
  } catch (error) {
    if (error.message === "Email already exists") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  }
});
router.get("/", userAuthorization, async (req, res) => {
  try {
    const token = req.cookies["token"];
    const signedInUserId = getUserIdFromToken(token);
    let users = await getUsers(signedInUserId);
    if (users === "User not Authorizied") {
      res.status(401).json({ message: "User not Authorizied" });
    } else if (users.length) {
      res.status(200).json({ message: "Success", data: users });
    } else {
      res.status(200).json({ message: "There is no Users!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.get("/:id", userAuthorization, async (req, res) => {
  const userId = req.params.id;
  try {
    const token = req.cookies["token"];
    const signedInUserId = getUserIdFromToken(token);
    let user = await getUserById(userId, signedInUserId);
    if (user === "User no longer exists!") {
      res.status(400).json({ message: "User no longer exists!" });
    } else if (user === "User not found") {
      res.status(400).json({ message: "User not found" });
    } else if (user === "ObjectId") {
      res.status(400).json({ message: "User id must be objectid" });
    } else if (user === "User not Authorizied") {
      res.status(401).json({ message: "User not Authorizied" });
    } else {
      res.status(200).json({ message: "Success", data: user });
    }
  } catch (error) {
    if (error === "ObjectId") {
      res.status(400).json({ message: "User id must be objectid" });
    } else {
      res.status(500).json({ message: "Error", error });
    }
  }
});

router.put("/:id", userAuthorization, async (req, res) => {
  const userId = req.params.id;
  try {
    const token = req.cookies["token"];
    const signedInUserId = getUserIdFromToken(token);
    let updatedUser = await updateUser(userId, req.body, signedInUserId);
    if (updatedUser === "User not Authorizied") {
      res.status(401).json({ message: "Use not Authorizied" });
    } else if (updatedUser) {
      res.status(201).json({ message: "Success", data: updatedUser });
    } else {
      res.status(200).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.delete("/:id", userAuthorization, async (req, res) => {
  let userId = req.params.id;
  try {
    const token = req.cookies["token"];
    const signedInUserId = getUserIdFromToken(token);
    let user = await deleteUser(userId, signedInUserId);
    if (user === "User not Authorizied") {
      res.status(401).json({ message: "Use not Authorizied" });
    } else if (user === "User no longer exists!") {
      res.status(400).json({ message: "User no longer exists!" });
    } else if (user === "User not found") {
      res.status(400).json({ message: "User not found" });
    } else {
      res.status(202).json({ message: "Success" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});
module.exports = router;
