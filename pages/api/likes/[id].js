import { connectToDatabase } from "../../../utils/mongodb";
import { Like } from "../../../models";
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
      const like = await Like.findById(id).lean();
      res.status(200).json({ like });
      break;
    }

    case "DELETE": {
      await Like.findByIdAndDelete(id);
      res.status(200).json({ serial: "Like deleted" });
    }

    default: {
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
