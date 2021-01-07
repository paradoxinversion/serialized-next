import { kebabCase } from "lodash";
import { SerialPart, Serial, User } from "../models";
import { connectToDatabase } from "../utils/mongodb";

export const getSerialPartBySearch = async ({
  authorUsername,
  parentSerialSlug,
  serialPartSlug,
}) => {
  try {
    await connectToDatabase();
    const author = await User.findOne({ username: authorUsername });
    const serial = await Serial.findOne({
      author: author._id,
      slug: parentSerialSlug,
    });
    const serialPart = await SerialPart.findOne({
      parentSerial: serial._id,
      slug: serialPartSlug,
    })
      .populate("author", "username")
      .lean();

    return serialPart;
  } catch (e) {
    throw e;
  }
};

export const getSerialParts = async (parentSerialId) => {
  try {
    await connectToDatabase();
    const serialParts = await SerialPart.find({ parentSerial: parentSerialId })
      .populate("author", "username")
      .lean();

    return serialParts;
  } catch (e) {
    throw e;
  }
};
export const getSerialPartById = async (serialPartId) => {
  try {
    await connectToDatabase();
    const serialPart = await SerialPart.findById(serialPartId)
      .populate("author", "username")
      .lean();

    return serialPart;
  } catch (e) {
    throw e;
  }
};

export const createSerialPart = async ({
  title,
  content,
  synopsis,
  parentSerial,
  author,
}) => {
  try {
    await connectToDatabase();
    const currentParts = await SerialPart.find({ parentSerial });
    console.log(currentParts.length);
    const serialPart = new SerialPart({
      title,
      content,
      synopsis: synopsis || "",
      parentSerial,
      slug: kebabCase(title),
      author,
      partNumber: currentParts.length + 1,
    });

    await serialPart.save();
    return serialPart;
  } catch (e) {
    throw e;
  }
};

export const deleteSerialPart = async (serialPartId) => {
  try {
    await connectToDatabase();
    const deletion = await SerialPart.findByIdAndRemove(serialPartId, {
      select: "id title",
    });
    return deletion;
  } catch (e) {
    throw e;
  }
};
export const deleteAllSerialParts = async (parentSerialId) => {
  try {
    await connectToDatabase();
    const deletion = await SerialPart.deleteMany({
      parentSerial: parentSerialId,
    });
    return deletion;
  } catch (e) {
    throw e;
  }
};

export const updateSerialPart = async ({
  serialPartId,
  title,
  content,
  synopsis,
}) => {
  try {
    await connectToDatabase();
    const serialPartUpdate = await SerialPart.findByIdAndUpdate(
      serialPartId,
      { title, content, synopsis },
      { new: true, omitUndefined: true }
    )
      .populate("author", "username")
      .populate("genre", "name id")
      .lean();
    return serialPartUpdate;
  } catch (e) {
    throw e;
  }
};
