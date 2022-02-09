const { getRecordById } = require("./readRecord");

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
  } catch (error) {}
}

module.exports = { deleteRecord };
