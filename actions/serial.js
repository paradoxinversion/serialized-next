import { Serial, User } from "../models";
import { connectToDatabase } from "../utils/mongodb";

export const getSerial = async (authorUsername, serialSlug) => {
  try {
    await connectToDatabase();
    const author = await User.findOne({ username: authorUsername });
    if (!author) {
      throw new Error("Author not found");
    }

    const serial = await Serial.findOne({
      author: author.id,
      slug: serialSlug,
    })
      .populate("author", "username")
      .populate("genre", "name")
      .lean();
    console.log("Got", serial);
    return serial;
  } catch (e) {
    throw e;
  }
};

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
