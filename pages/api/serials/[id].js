import { connectToDatabase } from "../../../utils/mongodb";
import { Serial } from "../../../models";
import { getSession } from "next-auth/client";
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
  const session = await getSession({ req });
  console.log(session);
  switch (method) {
    case "GET": {
      const serial = await Serial.findById(id).lean();
      res.status(200).json({ serial });
      break;
    }

    case "PUT": {
      const updateFields = req.body.updateSerial;
      const serial = await Serial.findByIdAndUpdate(id, updateFields, {
        new: true,
        lean: true,
      });
      res.status(200).json({ serial });
      break;
    }

    case "DELETE": {
      await Serial.findByIdAndDelete(id);
      res.status(200).json({ serial: "Serial deleted" });
    }

    default: {
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
