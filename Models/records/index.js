const mongoose = require("mongoose");

var recordSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  date: {
    type: Date,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  deleteDate: {
    type: Date,
  },
  createDate: {
    type: Date,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model("Records", recordSchema);
