import { connectToDatabase } from "../../utils/mongodb";
import { Serial } from "../../models";
import { kebabCase } from "lodash";
import { getSession } from "next-auth/client";
export default async (req, res) => {
  const {
    method,
    query: { author },
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
      let serials;
      if (author) {
        serials = await Serial.find({ author }).populate("author");
      }
      const includeNSFW = true;

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
      const { title, synopsis, genre, nsfw } = req.body.serial;
      const serial = new Serial({
        title,
        synopsis,
        genre,
        nsfw,
        creationDate: Date.now(),
        author: session.user.id,
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
