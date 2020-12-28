import { kebabCase } from "lodash";
import { SerialPart, User } from "../models";
import { connectToDatabase } from "../utils/mongodb";

export const getSerialParts = async (parentSerialId) => {
  console.log(parentSerialId);
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
    const deletion = await SerialPart.findByIdAndDelete(serialPartId);
    return deletion;
  } catch (e) {
    throw e;
  }
};
export const deleteAllSerialParts = async (parentSerialId) => {
  try {
    await connectToDatabase();
    const deletion = await SerialPart.deleteMany({ author: parentSerialId });
    return deletion;
  } catch (e) {
    throw e;
  }
};
