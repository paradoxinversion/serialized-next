import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { connectToDatabase } from "../../../utils/mongodb";
import { User } from "../../../models";
const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log(credentials);
        const { username, password } = credentials;
        await connectToDatabase();
        const user = await User.findOne({ username });
        if (user) {
          if (user.validatePassword(password)) {
            return Promise.resolve(user);
          } else {
            return Promise.resolve(false);
          }
        } else {
          // Return null or falseto reject credentials
          return Promise.resolve(null);
        }
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      if (user) {
        token.username = user.username;
        token.user = user._id;
        token.role = user.role;
      }

      return Promise.resolve(token);
    },
    session: async (session, user, token) => {
      return Promise.resolve({
        ...session,
        user: { username: user.username, role: user.role, id: user.user },
      });
    },
  },
  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,
};

export default (req, res) => NextAuth(req, res, options);
