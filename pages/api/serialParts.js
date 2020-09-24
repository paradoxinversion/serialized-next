import { connectToDatabase } from "../../utils/mongodb";
import { Serial, SerialPart } from "../../models";
import { kebabCase } from "lodash";
export default async (req, res) => {
  const { method } = req;

  try {
    await connectToDatabase();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

  switch (method) {
    case "GET": {
      const serialParts = await SerialPart.find({}).lean();
      res.status(200).json({ serialParts });
      break;
    }

    case "POST": {
      // userid will come from an authenticated user in the future
      const {
        title,
        content,
        parentSerial,
        userId,
        synopsis,
      } = req.body.serialPart;
      const serialParts = await SerialPart.find({ parentSerial });
      const serialPart = new SerialPart({
        title,
        content,
        lastModified: Date.now(),
        parentSerial,
        slug: _.kebabCase(title),
        partNumber: serialParts.length,
        author: userId,
        synopsis,
      });

      await serialPart.save();
      res.status(201).json({ serialPart });
      break;
    }
    default: {
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
