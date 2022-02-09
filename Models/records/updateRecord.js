const { getRecordById } = require("./readRecord");
const recordModel = require("./shcema");
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
  } catch (error) {}
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
module.exports = { updateRecord };
