const schedule = require("node-schedule");
const { createReport } = require("../Models/report/index");
const { getRecordsBetweenDates } = require("../Models/records/index");
const { updateUser, getUsers } = require("../Models/user/index");

const job = schedule.scheduleJob("0 0 * * *", () => {
  weeklyReports();
});

async function weeklyReports() {
  let lastReportedDate, diffTime, diffWeeks, from, to, userId;
  let createAReport = false;
  let currentDate = new Date();
  let users = await getUsers(undefined, "Admin");
  for (const user of users) {
    if (user._id) userId = user._id.valueOf();
    if (user.createDate) createDate = user.createDate;
    if (user.lastReported) {
      lastReportedDate = user.lastReported;
      diffTime = currentDate - lastReportedDate;
      diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      if (diffWeeks === 1) {
        from = dateObject(lastReportedDate);
        to = dateObject(currentDate);
        createAReport = true;
      }
    } else {
      diffTime = currentDate - createDate;
      diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      if (diffWeeks === 1) {
        from = dateObject(createDate);
        to = dateObject(currentDate);
        createAReport = true;
      }
    }
    if (createAReport) {
      const userRecords = await getRecordsBetweenDates(userId, from, to);
      const speedArr = recordsSpeed(userRecords);
      const distanceArr = recordsDistance(userRecords);
      const speed = getAverage(speedArr);
      const distance = getAverage(distanceArr);
      const report = { speed, distance };
      reported = await createReport(report, userId);
    }
    if (reported) {
      await updateUser(
        userId,
        { lastReported: new Date() },
        undefined,
        "Admin"
      );
    }
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
