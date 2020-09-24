import { connectToDatabase } from "../../utils/mongodb";
import { Genre } from "../../utils/models";
export default async (req, res) => {
  const { method } = req;
  res.setHeader("Content-Type", "application/json");

  try {
    await connectToDatabase();
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }

  switch (method) {
    case "GET": {
      const genres = await Genre.find({});
      res.statusCode = 200;
      res.end(JSON.stringify({ genres }));
      break;
    }

    case "POST": {
      const { name, description } = req.body.genre;
      const genre = new Genre({
        name,
        description,
      });
      res.statusCode = 201;
      res.end(JSON.stringify({ genre }));
      break;
    }
    default: {
      res.statusCode = 501;
      res.end(JSON.stringify({ error: "Method not implemented" }));
      break;
    }
  }
};
