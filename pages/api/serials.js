import { connectToDatabase } from "../../utils/mongodb";
import { Serial } from "../../models";
import { kebabCase } from "lodash";
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
      const includeNSFW = true;

      let serials;

      if (includeNSFW) {
        serials = await Serial.find().populate("author");
      } else {
        serials = await Serial.find({ nsfw: false }).populate("author");
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ serials }));
      break;
    }

    case "POST": {
      // userid will come from an authenticated user in the future
      const { title, synopsis, genre, nsfw, userId } = req.body.serial;
      const serial = new Serial({
        title,
        synopsis,
        genre,
        nsfw,
        creationDate: Date.now(),
        author: userId,
        slug: kebabCase(title),
      });

      await serial.save();
      res.statusCode = 201;
      res.end(JSON.stringify({ serial }));
      break;
    }
    default: {
      res.statusCode = 501;
      res.end(JSON.stringify({ error: "Method not implemented" }));
      break;
    }
  }
};
