import { ApolloServer, gql } from "apollo-server-micro";
import {
  getSerial,
  getSerials,
  getUserSerials,
  createSerial,
} from "../../actions/serial";
import { getUsers, returnUser, getUserByUsername } from "../../actions/user";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { logIn } from "../../actions/authentication";
import { Genre, User } from "../../models";
import { getGenres } from "../../actions/genre";
const typeDefs = gql`
  type Query {
    users: [User!]!
    user(username: String!): User
    serials: [Serial]
    serial(authorUsername: String!, serialSlug: String!): Serial
    authorized: User
    ownSerials: [Serial]
    genres: [Genre]
  }

  type Mutation {
    login(username: String!, password: String!): LoginResult
    createSerial(
      title: String!
      synopsis: String
      genre: String!
      nsfw: Boolean!
    ): Serial
  }
  type User {
    _id: String
    username: String
    role: Int
    biography: String
    viewNSFW: Boolean
  }

  type Genre {
    _id: String
    name: String
    description: String
  }

  type Serial {
    id: String
    title: String
    synopsis: String
    nsfw: Boolean
    slug: String
    author: User
    genre: Genre
  }

  type LoginResult {
    user: User
    error: String
  }
`;

const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch {
    return null;
  }
};

const getUser = async (userId) => {
  return await returnUser(userId);
};

const resolvers = {
  Query: {
    async authorized(parent, args, context) {
      if (!context.user) {
        return null;
      }
      return await getUser(context.user.id);
    },
    async users(parent, args, context) {
      return await getUsers();
    },
    async user(parent, { username }, context) {
      return await getUserByUsername(username);
    },
    async serials(parent, args, context) {
      return await getSerials();
    },
    async serial(parent, { authorUsername, serialSlug }) {
      return await getSerial(authorUsername, serialSlug);
    },
    async ownSerials(parent, args, context) {
      if (!context.user) {
        return null;
      }
      return await getUserSerials(context.user.id);
    },
    async genres(parent, args, context) {
      return await getGenres();
    },
  },
  Mutation: {
    async login(parent, { username, password }, context) {
      const loggedInUser = await logIn({ username, password });

      if (loggedInUser.result === 1) {
        const token = jwt.sign(
          { id: loggedInUser.user.id },
          process.env.SECRET
        );
        context.cookies.set("auth-token", token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 600000 * 6 * 6, // in ms
          secure: process.env.NODE_ENV === "production",
        });
        return { user: loggedInUser.user, error: null };
      } else {
        return { user: null, error: loggedInUser.error };
      }
    },
    async createSerial(parent, { title, synopsis, genre, nsfw }) {
      // const loggedInUser = await User.findById(context.user)
      // return await createSerial({title, synopsis, genre, nsfw})
      console.log(context.user);
      return null;
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const cookies = new Cookies(req, res);
    const token = cookies.get("auth-token");
    const user = verifyToken(token);
    return {
      cookies,
      user,
    };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
