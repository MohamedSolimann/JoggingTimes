const mongoose = require("mongoose");
const reportModel = require("./schema");

async function createReport(report, userId) {
  try {
    report._id = mongoose.Types.ObjectId();
    report.createDate = new Date();
    report.userId = userId;
    let newReport = new reportModel(report);
    await newReport.save();
    return newReport ? true : false;
  } catch (error) {
    throw error;
  }
}
module.exports = { createReport };
