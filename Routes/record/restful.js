const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const recordModel = require("../../Models/records/shcema");
const {
  createRecord,
  getRecordById,
  getRecords,
  updateRecord,
  deleteRecord,
} = require("../../Models/records/index");

router.post("/", async (req, res) => {
  const { date, time, distance, user_id } = req.body;
  try {
    const newRecord = await createRecord({
      _id: mongoose.Types.ObjectId(),
      date,
      time,
      distance,
      user_id,
      createDate: new Date(),
    });
    if (newRecord) {
      res.status(201).json({ message: "Success", data: newRecord });
    } else {
      res.status(400).json({ message: "Error", error: newRecord });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
  const recordId = req.params.id;
  try {
    let record = await getRecordById(recordId);
    if (record === "Record no longer exists!") {
      res.status(400).json({ message: "User no longer exists!" });
    } else if (record === "User not found") {
      res.status(400).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "Success", data: record });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Please check the user id" });
    } else {
      res.status(500).json({ message: "Error", error });
    }
  }
});
router.put("/:id", async (req, res) => {
  const recordId = req.params.id;
  try {
    let updatedRecord = await updateRecord(recordId, req.body);
    if (updatedRecord) {
      res.status(201).json({ message: "Success", data: updatedRecord });
    } else {
      res.status(201).json({ message: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.delete("/:id", async (req, res) => {
  let recordId = req.params.id;
  try {
    let record = await deleteRecord(recordId);
    if (record) {
      res.status(202).json({ message: "Success" });
    } else {
      res.status(200).json({ message: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
