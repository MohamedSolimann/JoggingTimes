const mongoose = require("mongoose");
const userModel = require("./schema");
const bcrypt = require("bcrypt");
const { userRoleAuth } = require("../../Routes/user/middleware");

async function createUser(user) {
  try {
    const commonEmail = await getUserByEmail(user.email);
    if (commonEmail) {
      throw new Error("Email already exists");
    }
    const updatedUser = updatedUserForCreation(user);
    let newUser = new userModel(updatedUser);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
}
function updatedUserForCreation(user) {
  const encryptedPassword = bcrypt.hashSync(user.password, 9);
  user.password = encryptedPassword;
  user._id = mongoose.Types.ObjectId();
  user.createDate = new Date();
  return user;
}
async function getUserByEmail(userEmail) {
  try {
    const user = await userModel.findOne({ email: userEmail }).lean();
    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
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
async function getUserById(userId, signedInUserId, userRole) {
  try {
    let userRoleAuthorization;
    const user = await userModel.findOne({ _id: userId }).lean();
    if (user) {
      if (userRole !== "Admin") {
        userRoleAuthorization = await userRoleAuth(signedInUserId, user._id);
      } else {
        userRoleAuthorization = true;
      }
      if (userRoleAuthorization) {
        if (user.deleteDate) {
          return "User no longer exists!";
        } else {
          return user;
        }
      } else {
        return "User not Authorizied";
      }
    } else {
      return "User not found";
    }
  } catch (error) {
    return "ObjectId";
  }
}
async function getUsers(signedInUserId, userRole) {
  const signedInUser = await getUserById(signedInUserId, undefined, "Admin");
  let users;
  try {
    if (signedInUser.role === "Admin" || userRole === "Admin") {
      users = await userModel.find().lean();
    } else if (signedInUser.role === "User Manager") {
      users = await userModel.find({ role: "Regular" }).lean();
    } else {
      users = "User not Authorizied";
    }
    return users;
  } catch (error) {}
}
async function updateUser(userId, data, signedInUserId, userRole) {
  try {
    const updatedBody = updateRequestBody(data);
    const user = await getUserById(userId, signedInUserId, userRole);
    if (user === "User not Authorizied") {
      return "User not Authorizied";
    } else if (user === "User no longer exists!") {
      return "User no longer exists!";
    } else if (user === "User not found ") {
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
  if (data.deleteDate) {
    updatedBody.deleteDate = data.deleteDate;
  }
  if (data.email) {
    updatedBody.email = data.email;
  }
  if (data.password) {
    updatedBody.lastRpasswordeported = data.password;
  }
  if (data.role) {
    updatedBody.role = data.role;
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
    } else if (user === "User not found ") {
      return "User not found";
    } else {
      const deletedUser = await userModel.updateOne(
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
  getUsers,
};
