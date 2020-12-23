import { Serial } from "../models";
import { connectToDatabase } from "../utils/mongodb";

export const getSerials = async () => {
  try {
    await connectToDatabase();
    const serials = await Serial.find({})
      .populate("author", "username")
      .populate("genre", "name")
      .lean();

    return serials;
  } catch (e) {
    throw e;
  }
};

export const getUserSerials = async (userId) => {
  console.log(userId);
  try {
    await connectToDatabase();
    const serials = await Serial.find({})
      .populate("author", "username")
      .populate("genre", "name")
      .lean();
    console.log(serials);
    return serials;
  } catch (e) {
    throw e;
  }
};
