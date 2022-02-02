const mongoose = require("mongoose");
const recordSchema = require("./shcema");

async function createRecord(record) {
  try {
    record._id = mongoose.Types.ObjectId();
    record.createDate = new Date();
    let newRecord = new recordSchema(record);
    await newRecord.save();
    return newRecord;
  } catch (error) {
    console.log(error);
  }
}
async function getRecordById(recordId) {
  try {
    const record = await recordSchema.findOne({ _id: recordId }).lean();
    if (record) {
      if (record.deletedDate) {
        return "Record no longer exists!";
      } else {
        return record;
      }
    } else {
      return "User not found";
    }
  } catch (error) {
    return false;
  }
}
async function getRecords() {
  try {
    const records = await recordSchema.find();
    if (records.length) {
      return records;
    } else {
      return false;
    }
  } catch (error) {}
}
async function updateRecord(recordId, data) {
  try {
    const record = await getRecordById(recordId);
    if (record._id) {
      const updatedBody = updateRequestBody(data);
      const updatedRecord = await recordSchema.findOneAndUpdate(
        { _id: recordId },
        { $set: updatedBody },
        { new: true }
      );
      if (updatedRecord) {
        return updatedRecord;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {}
}
async function deleteRecord(recordId) {
  try {
    const record = await getRecordById(recordId);
    if (record) {
      const deletedRecord = await recordSchema.updateOne(
        { _id: recordId },
        { $set: { deleteDate: new Date() } }
      );
      if (deletedRecord) {
        return deletedRecord;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {}
}

function updateRequestBody(data) {
  let updatedBody = {};
  if (data.distance) {
    updatedBody.distance = data.distance;
  }
  if (data.time) {
    updatedBody.time = data.time;
  }
  if (data.date) {
    updatedBody.date = data.date;
  }
  if (data.user_Id) {
    updatedBody.user_Id = data.user_Id;
  }

  return updatedBody;
}

module.exports = {
  createRecord,
  getRecordById,
  getRecords,
  updateRecord,
  deleteRecord,
};
