const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Regular", "User manger", "Admin"],
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
module.exports = mongoose.model("User", userSchema);
