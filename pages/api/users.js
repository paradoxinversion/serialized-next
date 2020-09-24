import { connectToDatabase } from "../../utils/mongodb";
import { User } from "../../utils/models";
import bcrypt from "bcrypt";
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
      const users = await User.find({}).lean();
      res.statusCode = 200;
      res.end(JSON.stringify({ users }));
      break;
    }

    case "POST": {
      const { username, password, birthDate } = req.body.user;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({ error: "A user already exists with that username" })
        );
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
      res.end(JSON.stringify({ user: "User Created" }));
      break;
    }
    default: {
      res.statusCode = 501;
      res.end(JSON.stringify({ error: "Method not implemented" }));
      break;
    }
  }
};
