import { connectToDatabase } from "../../utils/mongodb";
import { Like } from "../../models";
export default async (req, res) => {
  const { method } = req;

  try {
    await connectToDatabase();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

  switch (method) {
    case "GET": {
      const likes = await Likes.find({}).lean();
      res.status(200).json({ likes });
      break;
    }

    case "POST": {
      const { likeType, subject, userId } = req.body.like;
      const like = new Like({
        likeType,
        subject,
        user: userId,
      });

      res.status(201).json({ like });
      break;
    }
    default: {
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
