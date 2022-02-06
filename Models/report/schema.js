const mongoose = require("mongoose");

var reportModel = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Report", reportModel);
