import { ApolloServer, gql } from "apollo-server-micro";
import { getSerials, getUserSerials } from "../../actions/serial";
import { getUsers, returnUser } from "../../actions/user";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { logIn } from "../../actions/authentication";
const typeDefs = gql`
  type Query {
    users: [User!]!
    serials: [Serial]
    authorized: User
    ownSerials: [Serial]
  }

  type Mutation {
    login(username: String!, password: String!): LoginResult
  }
  type User {
    _id: String
    username: String
    role: Int
    biography: String
  }

  type Genre {
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
    users(parent, args, context) {
      return getUsers();
    },
    serials(parent, args, context) {
      return getSerials();
    },
    async ownSerials(parent, args, context) {
      if (!context.user) {
        return null;
      }
      return await getUserSerials(context.user.id);
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
          maxAge: 6 * 60 * 60,
          secure: process.env.NODE_ENV === "production",
        });
        return { user: loggedInUser.user, error: null };
      } else {
        return { user: null, error: loggedInUser.error };
      }
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
