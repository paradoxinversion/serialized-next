import { kebabCase } from "lodash";
import { Serial, User } from "../models";
import { connectToDatabase } from "../utils/mongodb";
import { deleteAllSerialParts } from "./serialPart";

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
      .populate("genre", "name id")
      .lean();
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
  try {
    await connectToDatabase();
    const serials = await Serial.find({ author: userId })
      .populate("author", "username")
      .populate("genre", "name")
      .lean();
    return serials;
  } catch (e) {
    throw e;
  }
};

export const createSerial = async ({
  title,
  synopsis,
  genre,
  nsfw,
  userId,
}) => {
  try {
    const newSerial = new Serial({
      title,
      synopsis: synopsis || "",
      genre,
      nsfw,
      author: userId,
      slug: kebabCase(title),
    });

    await newSerial.save();
    return newSerial;
  } catch (e) {
    throw e;
  }
};

export const editserial = async ({
  serialId,
  title,
  synopsis,
  genre,
  nsfw,
}) => {
  try {
    const serial = await Serial.findByIdAndUpdate(
      serialId,
      {
        title,
        synopsis,
        genre,
        nsfw,
        slug: title ? kebabCase(title) : undefined,
      },
      { omitUndefined: true, new: true }
    );

    await serial.save();
    return serial;
  } catch (e) {
    throw e;
  }
};

export const deleteSerial = async (serialId) => {
  try {
    // First delete the serial's parts
    const partDeletionResult = await deleteAllSerialParts(serialId);
    console.log("deletion::", partDeletionResult);
    if (partDeletionResult.ok) {
      // deletion successful
      // number of deleted parts is result.deletedCount
      // We can now delete the serial itself
      const serialDeletionResult = await Serial.findByIdAndRemove(serialId, {
        select: "title",
      });
      if (serialDeletionResult) {
        return serialDeletionResult;
      } else {
        console.log("SDR", serialDeletionResult);
        throw new Error("Deletion failed");
      }
    }
  } catch (e) {
    throw e;
  }
};
