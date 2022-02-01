const mongoose = require("mongoose");
const userModel = require("./schema");
const bcrypt = require("bcrypt");

const createUser = async (user) => {
  try {
    const encryptedPassword = bcrypt.hashSync(password, 9);
    user.password = encryptedPassword;
    const newUser = new userModel(user);
    await newUser.save();
    return newUser;
  } catch (error) {}
};
const getUserByEmail = async (userEmail) => {
  try {
    const user = await userModel.findOne({ email: userEmail });
    return user;
  } catch (error) {}
};
const userAuthentication = (email, password) => {
  try {
    const user = getUserByEmail(email);
    if (user) {
      const validPassword = bcrypt.compareSync(
        password,
        user.password
      );
      return validPassword;
    } else {
      return false;
    }
  } catch (error) {}
};
module.exports = { createUser, userAuthentication };
