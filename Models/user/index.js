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
module.exports = { createUser, userAuthentication, getUserById };
