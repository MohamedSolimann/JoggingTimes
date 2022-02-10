const express = require("express");
const router = express.Router();
const { getRecordsBetweenDates } = require("../../Models/records/index");
const { userAuthorization } = require("../user/middleware");
const {
  catchValidationErrors,
  fitlerByDateValidation,
} = require("../../validation/record.validation");
router.post(
  "/betweenDates",
  userAuthorization,
  fitlerByDateValidation,
  catchValidationErrors,
  async (req, res) => {
    const { from, to } = req.body;
    try {
      const records = await getRecordsBetweenDates(from, to);
      if (records) {
        res.status(200).json({ message: "Success", data: records });
      } else {
        res.status(200).json({ message: "There is no Records!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error", error });
    }
  }
);
module.exports = router;
