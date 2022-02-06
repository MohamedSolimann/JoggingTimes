const { createReport } = require("../Models/report/index");
const { getRecordsBetweenDates } = require("../Models/records/index");
const { updateUser } = require("../Models/user/index");

async function weeklyReports(lastReported, userId, creationDate) {
  let reported = false;
  let signedInDate = new Date();
  let lastReportedDate, diffTime, diffWeeks, from, to;
  if (lastReported) {
    lastReportedDate = new Date(`${lastReported}`);
    diffTime = signedInDate - lastReportedDate;
    diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  } else {
    UserCreationDate = new Date(`${creationDate}`);
    diffTime = signedInDate - UserCreationDate;
    diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  }
  if (diffWeeks >= 1) {
    if (lastReported) {
      from = dateObject(lastReportedDate);
      to = dateObject(signedInDate);
    } else {
      from = dateObject(UserCreationDate);
      to = dateObject(signedInDate);
    }
    const userRecords = await getRecordsBetweenDates(from, to);
    const speedArr = recordsSpeed(userRecords);
    const distanceArr = recordsDistance(userRecords);
    const speed = getAverage(speedArr);
    const distance = getAverage(distanceArr);
    const report = { speed, distance };
    reported = await createReport(report, userId);
  }
  if (reported) {
    await updateUser(userId, { lastReported: new Date() });
  }
}
function recordsSpeed(records) {
  let speeds = [];
  records.forEach((record) => {
    speeds.push(parseInt(record.distance) / parseInt(record.time));
  });
  return speeds;
}
function recordsDistance(records) {
  let distances = [];
  records.forEach((record) => {
    distances.push(parseInt(record.distance));
  });
  return distances;
}
function getAverage(arr) {
  let total = 0;
  arr.forEach((val) => {
    total = +val;
  });
  return total / arr.length;
}
function dateObject(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

module.exports = { weeklyReports };
