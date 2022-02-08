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
function udpateRecordForCreation(record, userId) {
  record._id = mongoose.Types.ObjectId();
  record.createDate = new Date();
  record.user_id = userId;
  if (record.date.month.length === 1)
    record.date.month = "0".concat(record.date.month);
  if (record.date.day.length === 1)
    record.date.day = "0".concat(record.date.day);
  record.date = `${record.date.year}-${record.date.month}-${record.date.day}`;
  return record;
}
module.exports = { createRecord };
