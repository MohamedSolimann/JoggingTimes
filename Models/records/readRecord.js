const recordModel = require("./shcema");
const { userRoleAuth } = require("../../Routes/user/middleware");
const { getUserById } = require("../user/index");

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
    return error.kind;
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
  } catch (error) {}
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
  } catch (error) {}
}
async function getRecordsOfUser(userId) {
  try {
    const records = await recordModel.find({ userId }).lean();
    if (records.length) {
      return records;
    } else {
      return false;
    }
  } catch (error) {}
}

module.exports = {
  getRecordById,
  getRecords,
  getRecordsBetweenDates,
  getRecordsOfUser,
};
