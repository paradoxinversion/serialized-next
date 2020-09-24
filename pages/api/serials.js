import { connectToDatabase } from "../../utils/mongodb";
import { Serial } from "../../models";
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
      const includeNSFW = true;

      let serials;

      if (includeNSFW) {
        serials = await Serial.find().populate("author");
      } else {
        serials = await Serial.find({ nsfw: false }).populate("author");
      }
      res.status(200).json({ serials });
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
      res.status(201).json({ serial });
      break;
    }
    default: {
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
