import { connectToDatabase } from "../../../utils/mongodb";
import { User } from "../../../models";
export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const {
    query: { id },
    method,
  } = req;

  try {
    await connectToDatabase();
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }

  switch (method) {
    case "GET": {
      const user = await User.findById(id).lean();
      res.statusCode = 200;
      res.end(JSON.stringify({ user }));
      break;
    }

    case "PUT": {
      const updateFields = req.body.updateUser;
      const user = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
        lean: true,
      });
      res.statusCode = 200;
      res.end(JSON.stringify({ user }));
      break;
    }

    case "DELETE": {
      await User.findByIdAndDelete(id);
      res.statusCode = 200;
      res.end(JSON.stringify({ user: "User deleted" }));
    }

    default: {
      res.statusCode = 501;
      res.end(JSON.stringify({ error: "Method not implemented" }));
      break;
    }
  }
};
