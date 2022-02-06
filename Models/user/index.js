const mongoose = require("mongoose");
const userModel = require("./schema");
const bcrypt = require("bcrypt");

async function createUser(user) {
  try {
    const encryptedPassword = bcrypt.hashSync(user.password, 9);
    user.password = encryptedPassword;
    user._id = mongoose.Types.ObjectId();
    user.createDate = new Date();
    let newUser = new userModel(user);
    await newUser.save();
    return newUser;
  } catch (error) {
    return error;
  }
}
async function getUserByEmail(userEmail) {
  try {
    const user = await userModel.findOne({ email: userEmail }).lean();
    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (error) {}
}
async function userAuthentication(email, password) {
  try {
    const user = await getUserByEmail(email);
    if (user) {
      const validPassword = bcrypt.compareSync(password, user.password);
      if (validPassword) {
        return user;
      }
    } else {
      return false;
    }
  } catch (error) {}
}
async function getUserById(userId) {
  try {
    const user = await userModel.findOne({ _id: userId }).lean();
    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (error) {}
}
async function updateUser(userId, data) {
  try {
    const updatedBody = updateRequestBody(data);
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: updatedBody },
      { new: true }
    );
    if (updatedUser) {
      return updatedUser;
    } else {
      return false;
    }
  } catch (error) {}
}
function updateRequestBody(data) {
  let updatedBody = {};
  if (data.lastReported) {
    updatedBody.lastReported = data.lastReported;
  }
  if (data.email) {
    updatedBody.lastReported = data.lastReported;
  }
  if (data.password) {
    updatedBody.lastReported = data.lastReported;
  }
  if (data.role) {
    updatedBody.lastReported = data.lastReported;
  }

  return updatedBody;
}
module.exports = { createUser, userAuthentication, getUserById, updateUser };
