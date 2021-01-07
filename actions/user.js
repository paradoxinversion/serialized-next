import { User } from "../models";
import { connectToDatabase } from "../utils/mongodb";
import bcrypt from "bcryptjs";

export const returnUser = async (userId) => {
  try {
    await connectToDatabase();
    const user = await User.findById(userId).lean();
    return user;
  } catch (e) {
    throw e;
  }
};
export const getUserByUsername = async (username) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ username }).select("-password").lean();
    return user;
  } catch (e) {
    throw e;
  }
};
export const getUsers = async () => {
  try {
    await connectToDatabase();
    const users = await User.find({}).lean();
    return users;
  } catch (e) {
    throw e;
  }
};
export const registerUser = async ({ username, password, birthdate }) => {
  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("User Exists");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );
    const user = new User({
      username,
      password: hashedPassword,
      birthDate,
    });

    await user.save();
    return user;
  } catch (e) {
    throw e;
  }
};

export const updateUserProfile = async ({ id, biography, viewNSFW }) => {
  try {
    connectToDatabase();
    const user = await User.findByIdAndUpdate(
      id,
      { biography, viewNSFW },
      { omitUndefined: true, new: true }
    ).select("-password");

    return user;
  } catch (e) {
    throw e;
  }
};
