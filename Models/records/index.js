const mongoose = require("mongoose");
const reportSchema = require("./schema");

async function createRecord(record) {
  try {
    record._id = mongoose.Types.ObjectId();
    reocrd.createDate = new Date();
    let newRecord = new reportSchema(record);
    await newRecord.save();
    return newRecord;
  } catch (error) {
    console.log(error);
  }
}
async function getRecordById(recordId) {
  try {
    const record = await reportSchema.findOne({ _id: recordId }).lean();
    if (record) {
      return user;
    } else {
      return "User not found";
    }
  } catch (error) {}
}
async function getRecords() {
  try {
    const records = await reportSchema.find();
    if (record) {
      return records;
    } else {
      return false;
    }
  } catch (error) {}
}
async function updatedRecord(recordId, data) {
  try {
    const updatedBody = updateRequestBody(data);
    const updatedRecord = await reportSchema.findOneAndUpdate(
      { _id: recordId },
      { $set: updatedBody },
      { new: true }
    );
    if (updatedRecord) {
      return updatedRecord;
    } else {
      return false;
    }
  } catch (error) {}
}
async function deleteRecord(recordId) {
  try {
    const record = await getReocrdById(recordId);
    if (record) {
      const deletedRecord = await reportSchema.updateOne(
        { _id: recordId },
        { $set: { deleteDate: new Date() } }
      );
      if (deletedRecord) {
        return deletedRecord;
      } else {
        return false;
      }
    } else {
      return "User not found";
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
  updatedRecord,
  deleteRecord,
};
