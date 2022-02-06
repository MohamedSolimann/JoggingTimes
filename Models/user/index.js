const mongoose = require("mongoose");
const userModel = require("./schema");
const bcrypt = require("bcrypt");
const { userRoleAuth } = require("../../Routes/user/middleware");

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
async function getUserById(userId, signedInUserId) {
  try {
    const user = await userModel.findOne({ _id: userId }).lean();
    if (user) {
      const userRoleAuthorization = await userRoleAuth(
        signedInUserId,
        user._id
      );
      if (userRoleAuthorization) {
        if (user.deleteDate) {
          return "User no longer exists!";
        } else {
          return record;
        }
      } else {
        return "User not Authorizied";
      }
    } else {
      return "User not found";
    }
  } catch (error) {}
}
async function updateUser(userId, data, signedInUserId) {
  try {
    const updatedBody = updateRequestBody(data);
    const user = await getUserById(userId, signedInUserId);
    if (user === "User not Authorizied") {
      return "User not Authorizied";
    } else if (user === "User no longer exists!") {
      return "User no longer exists!";
    } else if (record === "User not found ") {
      return "User not found";
    } else {
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
async function deleteUser(userId, signedInUserId) {
  try {
    const user = await getUserById(userId, signedInUserId);
    if (user === "User not Authorizied") {
      return "User not Authorizied";
    } else if (user === "User no longer exists!") {
      return "User no longer exists!";
    } else if (record === "User not found ") {
      return "User not found";
    } else {
      const deletedUser = await recordModel.updateOne(
        { _id: userId },
        { $set: { deleteDate: new Date() } }
      );
      if (deletedUser) {
        return deletedUser;
      } else {
        return false;
      }
    }
  } catch (error) {}
}
module.exports = {
  createUser,
  userAuthentication,
  getUserById,
  updateUser,
  deleteUser,
};
