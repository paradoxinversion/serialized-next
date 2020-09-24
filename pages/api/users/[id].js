import { connectToDatabase } from "../../../utils/mongodb";
import { User } from "../../../models";
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
      const user = await User.findById(id).lean();
      res.status(200).json({ user });
      break;
    }

    case "PUT": {
      const updateFields = req.body.updateUser;
      const user = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
        lean: true,
      });
      res.status(200).json({ user });
      break;
    }

    case "DELETE": {
      await User.findByIdAndDelete(id);
      res.status(200).json({ user: "User deleted" });
    }

    default: {
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
