import { User } from "../models";
import { connectToDatabase } from "../utils/mongodb";

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
