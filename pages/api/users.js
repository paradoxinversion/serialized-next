import { connectToDatabase } from "../../utils/mongodb";
import { User } from "../../models";
import bcrypt from "bcrypt";
export default async (req, res) => {
  const { method } = req;

  try {
    await connectToDatabase();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

  switch (method) {
    case "GET": {
      const users = await User.find({}).lean();

      res.status(200).json({ users });
      break;
    }

    case "POST": {
      const { username, password, birthDate } = req.body.user;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.statusCode = 400;
        res
          .status(400)
          .json({ error: "A user already exists with that username" });
        break;
      }
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT)
      );
      const user = new User({
        username,
        password: hashedPassword,
        birthDate,
      });

      await user.save();
      res.statusCode = 201;
      res.status(201).json({ user: "User Created" });
      break;
    }
    default: {
      res.statusCode = 501;
      res.status(501).json({ error: "Method not implemented" });
      break;
    }
  }
};
