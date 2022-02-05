const mongoose = require("mongoose");
const recordSchema = require("./shcema");
const { userRoleAuth } = require("../../Routes/user/middleware");
async function createRecord(record) {
  try {
    record._id = mongoose.Types.ObjectId();
    record.createDate = new Date();
    if (record.date.month.length === 1)
      record.date.month = "0".concat(record.date.month);
    if (record.date.day.length === 1)
      record.date.day = "0".concat(record.date.day);
    record.date = `${record.date.year}-${record.date.month}-${record.date.day}`;
    let newRecord = new recordSchema(record);
    await newRecord.save();
    return newRecord;
  } catch (error) {
    console.log(error);
  }
}
async function getRecordById(recordId, signedInUserId) {
  try {
    const record = await recordSchema.findOne({ _id: recordId }).lean();
    if (record) {
      if (record.deleteDate) {
        return "Record no longer exists!";
      } else {
        const userRoleAuthorization = await userRoleAuth(
          signedInUserId,
          record.user_id.valueOf()
        );
        if (userRoleAuthorization) {
          return record;
        } else {
          return "User not Authorizied";
        }
      }
    } else {
      return "Record not found";
    }
  } catch (error) {
    return error.kind;
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
async function getRecordsBetweenDates(fromDate, toDate) {
  try {
    fromDate = `${fromDate.year}-${fromDate.month}-${fromDate.day}`;
    toDate = `${toDate.year}-${toDate.month}-${toDate.day}`;
    const records = await recordSchema.find({
      date: { $gte: fromDate, $lte: toDate },
    });
    if (records.length) {
      return records;
    } else {
      return false;
    }
  } catch (error) {}
}
async function updateRecord(recordId, data, signedInId) {
  try {
    const record = await getRecordById(recordId, signedInId);
    if (record === "User not Authorizied") {
      return "User not Authorizied";
    } else if (record._id) {
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
async function deleteRecord(recordId, signedInUserId) {
  try {
    const record = await getRecordById(recordId, signedInUserId);
    if (record === "User not Authorizied") {
      return "User not Authorizied";
    } else if (record === "Record no longer exists!") {
      return "Record no longer exists!";
    } else if (record === "Record not found ") {
      return "Record not found";
    } else {
      const deletedRecord = await recordSchema.updateOne(
        { _id: recordId },
        { $set: { deleteDate: new Date() } }
      );
      if (deletedRecord) {
        return deletedRecord;
      } else {
        return false;
      }
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
  getRecordsBetweenDates,
};
