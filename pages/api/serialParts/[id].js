import { connectToDatabase } from "../../../utils/mongodb";
import { SerialPart } from "../../../models";
export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  try {
    await connectToDatabase();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

  switch (method) {
    case "GET": {
      const serialPart = await SerialPart.findById(id).lean();
      res.status(200).json({ serialPart });
      break;
    }

    case "PUT": {
      const updateFields = req.body.updateSerialPart;
      const serialPart = await SerialPart.findByIdAndUpdate(id, updateFields, {
        new: true,
        lean: true,
      });
      res.status(200).json({ serialPart });
      break;
    }

    case "DELETE": {
      await SerialPart.findByIdAndDelete(id);
      res.status(200).json({ serial: "Serial Part deleted" });
    }

    default: {
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
