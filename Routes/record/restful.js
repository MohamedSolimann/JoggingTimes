const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  createValidation,
  catchValidationErrors,
} = require("../../validation/record.validation");
const {
  createRecord,
  getRecordById,
  getRecords,
  updateRecord,
  deleteRecord,
} = require("../../Models/records/index");
const { userAuthorization, getUserIdFromToken } = require("../user/middleware");

router.post(
  "/",
  userAuthorization,
  createValidation,
  catchValidationErrors,
  async (req, res) => {
    try {
      const newRecord = await createRecord(req.body);
      if (newRecord) {
        res.status(201).json({ message: "Success", data: newRecord });
      } else {
        res.status(400).json({ message: "Error", error: newRecord });
      }
    } catch (error) {
      res.status(500).json({ message: "Error", error });
    }
  }
);
router.get("/", userAuthorization, async (req, res) => {
  try {
    const records = await getRecords();
    if (records) {
      res.status(200).json({ message: "Success", data: records });
    } else {
      res.status(200).json({ message: "There is no Records!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.get("/:id", userAuthorization, async (req, res) => {
  const recordId = req.params.id;
  try {
    const token = req.cookies["token"];
    const signedInUserId = getUserIdFromToken(token);
    let record = await getRecordById(recordId, signedInUserId);
    if (record === "Record no longer exists!") {
      res.status(400).json({ message: "Record no longer exists!" });
    } else if (record === "Record not found") {
      res.status(400).json({ message: "Record not found" });
    } else if (record === "ObjectId") {
      res.status(400).json({ message: "Record id must be objectid" });
    } else if (record === "User not Authorizied") {
      res.status(403).json({ message: "User not Authorizied" });
    } else {
      res.status(200).json({ message: "Success", data: record });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Please check the record id" });
    } else {
      res.status(500).json({ message: "Error", error });
    }
  }
});
router.put("/:id", userAuthorization, async (req, res) => {
  const recordId = req.params.id;
  try {
    const token = req.cookies["token"];
    const signedInUserId = getUserIdFromToken(token);
    let updatedRecord = await updateRecord(recordId, req.body, signedInUserId);
    if (updatedRecord === "User not Authorizied") {
      res.status(403).json({ message: "Use not Authorizied" });
    } else if (updatedRecord) {
      res.status(201).json({ message: "Success", data: updatedRecord });
    } else {
      res.status(200).json({ message: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.delete("/:id", userAuthorization, async (req, res) => {
  let recordId = req.params.id;
  try {
    const token = req.cookies["token"];
    const signedInUserId = getUserIdFromToken(token);
    let record = await deleteRecord(recordId, signedInUserId);
    if (record === "User not Authorizied") {
      res.status(403).json({ message: "Use not Authorizied" });
    } else if (record === "Record no longer exists!") {
      res.status(400).json({ message: "Record no longer exists!" });
    } else if (record === "Record not found") {
      res.status(400).json({ message: "Record not found" });
    } else {
      res.status(202).json({ message: "Success" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
