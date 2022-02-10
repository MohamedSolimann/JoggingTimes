const mongoose = require("mongoose");
const recordModel = require("./shcema");
const { userRoleAuth } = require("../../Routes/user/middleware");
const { getUserById } = require("../user/index");

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
async function getRecordById(recordId, signedInUserId) {
  try {
    const record = await recordModel.findOne({ _id: recordId }).lean();
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
    throw error.kind;
  }
}
async function getRecords(signedInUserId, userRole) {
  try {
    const signedInUser = await getUserById(signedInUserId, undefined, "Admin");
    if (signedInUser.role === "Admin" || userRole === "Admin") {
      records = await recordModel.find().lean();
    } else if (signedInUser.role === "User Manager") {
      records = await recordModel.find({ role: "Regular" }).lean();
    } else {
      records = await recordModel.find({ user_id: signedInUserId }).lean();
    }
    return records;
  } catch (error) {
    throw error;
  }
}
async function getRecordsBetweenDates(userId, fromDate, toDate) {
  try {
    fromDate = `${fromDate.year}-${fromDate.month}-${fromDate.day}`;
    toDate = `${toDate.year}-${toDate.month}-${toDate.day}`;
    const records = await recordModel.find({
      userId,
      date: { $gte: fromDate, $lte: toDate },
    });
    if (records.length) {
      return records;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}
async function updateRecord(recordId, data, signedInId) {
  try {
    const record = await getRecordById(recordId, signedInId);
    const updatedBody = updateRequestBody(data, record.date);
    if (record === "User not Authorizied") {
      return "User not Authorizied";
    } else if (record._id) {
      const updatedRecord = await recordModel.findOneAndUpdate(
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
  } catch (error) {
    throw error;
  }
}
function updateRequestBody(data, recordDate) {
  let updatedBody = {};
  let dateObj = {};
  if (data.distance) {
    updatedBody.distance = data.distance;
  }
  if (data.date) {
    if (data.date.year) dateObj.year = data.date.year;
    else dateObj.year = recordDate.getFullYear();
    if (data.date.month) dateObj.month = data.date.month;
    else dateObj.month = recordDate.getMonth();
    if (data.date.day) dateObj.day = data.date.day;
    else dateObj.day = String(recordDate.getDate());
    if (dateObj.month.length === 1) dateObj.month = "0".concat(dateObj.month);
    if (dateObj.day.length === 1) dateObj.day = "0".concat(dateObj.day);
    updatedBody.date = `${dateObj.year}-${dateObj.month}-${dateObj.day}`;
  }
  if (data.time) {
    updatedBody.time = data.time;
  }
  if (data.user_Id) {
    updatedBody.user_Id = data.user_Id;
  }
  return updatedBody;
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
      const deletedRecord = await recordModel.updateOne(
        { _id: recordId },
        { $set: { deleteDate: new Date() } }
      );
      if (deletedRecord) {
        return deletedRecord;
      } else {
        return false;
      }
    }
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createRecord,
  getRecordById,
  getRecords,
  getRecordsBetweenDates,
  updateRecord,
  deleteRecord,
};
