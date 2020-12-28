import { User } from "../models";
import { connectToDatabase } from "../utils/mongodb";
import bcrypt from "bcryptjs";

export const logIn = async ({ username, password }) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.validatePassword(password)) {
      throw new Error("Password incorrect");
    }

    return { result: 1, user, error: null };
  } catch (e) {
    return { result: 0, error: e.message, user: null };
  }
};

export const register = async ({ username, password, birthdate, email }) => {
  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ username });
    console.log("EU", existingUser);
    if (existingUser) {
      throw new Error("Username unavailable.");
    }
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );
    const user = new User({
      username,
      password: hashedPassword,
      birthDate: birthdate,
      email,
    });

    await user.save();

    return { result: 1, user: user, error: null };
  } catch (e) {
    return { result: 0, error: e.message, user: null };
  }
};
