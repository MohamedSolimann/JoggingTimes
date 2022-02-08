const mongoose = require("mongoose");
const recordModel = require("./shcema");
async function createRecord(record, userId) {
  try {
    const updatedRecord = udpateRecordForCreation(record, userId);
    let newRecord = new recordModel(updatedRecord);
    await newRecord.save();
    return newRecord;
  } catch (error) {
    throw error;
  }
}
module.exports = { createRecord };
