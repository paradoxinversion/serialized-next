import { connectToDatabase } from "../../utils/mongodb";
import { Genre } from "../../models";
export default async (req, res) => {
  const { method } = req;

  try {
    await connectToDatabase();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

  switch (method) {
    case "GET": {
      const genres = await Genre.find({});
      res.status(200).json({ genres });
      break;
    }

    case "POST": {
      const { name, description } = req.body.genre;
      const genre = new Genre({
        name,
        description,
      });
      res.status(201).json({ genre });
      break;
    }
    default: {
      res.statusCode = 501;
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
