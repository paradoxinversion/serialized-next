import { ApolloServer, gql } from "apollo-server-micro";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import {
  getSerial,
  getSerials,
  getUserSerials,
  createSerial,
  editserial,
  deleteSerial,
  getSerialById,
} from "../../actions/serial";
import { getUsers, returnUser, getUserByUsername } from "../../actions/user";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { logIn, register } from "../../actions/authentication";
import { getGenres } from "../../actions/genre";
import {
  createSerialPart,
  getSerialPartById,
  getSerialParts,
  updateSerialPart,
  deleteSerialPart as removeSerialPart,
} from "../../actions/serialPart";
import { Serial, SerialPart } from "../../models";
const typeDefs = gql`
  scalar Date

  type Query {
    users: [User!]!
    user(username: String!): User
    serials: [Serial]
    serial(authorUsername: String!, serialSlug: String!): Serial
    serialById(serialId: String!): Serial
    serialParts(parentSerial: String!): [SerialPart]
    serialPartById(serialPartId: String!): SerialPart
    authorized: User
    ownSerials: [Serial]
    genres: [Genre]
  }

  type Mutation {
    login(username: String!, password: String!): LoginResult
    register(
      username: String!
      password: String
      email: String!
      birthdate: Date!
    ): RegisterResult
    createSerial(
      title: String!
      synopsis: String
      genre: String!
      nsfw: Boolean!
    ): Serial

    editSerial(
      serialId: String!
      title: String!
      synopsis: String
      genre: String!
      nsfw: Boolean!
    ): Serial

    createSerialPart(
      parentSerial: String!
      title: String!
      content: String!
      synopsis: String
      author: String!
    ): SerialPart

    deleteSerial(serialId: String!): DeleteSerialResult

    editSerialPart(
      serialPartId: String!
      title: String
      synopsis: String
      content: String
    ): SerialPart

    deleteSerialPart(serialPartId: String!): Deletion
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
    _id: String
    title: String
    synopsis: String
    nsfw: Boolean
    slug: String
    author: User
    genre: Genre
  }

  type SerialPart {
    _id: String
    title: String
    content: String
    parentSerial: Serial
    slug: String
    partNumber: Int
    author: User
    synopsis: String
  }

  type LoginResult {
    user: User
    error: String
  }

  type RegisterResult {
    user: User
    error: String
  }

  type DeleteSerialResult {
    deletedSerial: Serial
    error: String
  }
  type Deletion {
    resourceName: String
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
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
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
    async serialParts(parent, { parentSerial }, context) {
      return await getSerialParts(parentSerial);
    },
    async serial(parent, { authorUsername, serialSlug }) {
      return await getSerial(authorUsername, serialSlug);
    },
    async serialById(parent, { serialId }, context) {
      return await getSerialById(serialId);
    },
    async ownSerials(parent, args, context) {
      if (!context.user) {
        return null;
      }
      return await getUserSerials(context.user.id);
    },
    async serialPartById(parent, { serialPartId }, context) {
      return await getSerialPartById(serialPartId);
    },
    async genres(parent, args, context) {
      return await getGenres();
    },
  },
  Mutation: {
    async register(parent, { username, password, birthdate, email }, context) {
      const registrationResult = await register({
        username,
        password,
        birthdate,
        email,
      });

      if (registrationResult.result === 1) {
        const token = jwt.sign(
          { id: registrationResult.user.id },
          process.env.SECRET
        );
        context.cookies.set("auth-token", token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 600000 * 6 * 6, // in ms
          secure: process.env.NODE_ENV === "production",
        });
        return { user: registrationResult.user, error: null };
      } else {
        return { user: null, error: registrationResult.error };
      }
    },
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
    async createSerial(parent, { title, synopsis, genre, nsfw }, context) {
      // const loggedInUser = await User.findById(context.user)
      return await createSerial({
        title,
        synopsis,
        genre,
        nsfw,
        userId: context.user.id,
      });
    },
    async editSerial(
      parent,
      { serialId, title, synopsis, genre, nsfw },
      context
    ) {
      return await editserial({
        title,
        synopsis,
        genre,
        nsfw,
        serialId,
      });
    },
    async createSerialPart(
      parent,
      { title, synopsis, parentSerial, content, author },
      context
    ) {
      return await createSerialPart({
        title,
        synopsis,
        parentSerial,
        content,
        author,
      });
    },
    async deleteSerial(parent, { serialId }, context) {
      const userId = context.user.id;
      if (userId) {
        const serial = await Serial.findById(serialId);
        if (serial) {
          const userIsAuthor = serial.isAuthor(userId);
          if (userIsAuthor) {
            const deletion = await deleteSerial(serialId);
            console.log("del::", deletion);
            return {
              deletedSerial: deletion,
              error: null,
            };
          }
        } else {
          return {
            deletedSerial: null,
            error: "Serial not found",
          };
        }
      } else {
        return {
          deletedSerial: null,
          error: "user is not author",
        };
      }
    },
    async editSerialPart(
      parent,
      { serialPartId, title, synopsis, content },
      context
    ) {
      const userId = context.user.id;
      if (userId) {
        const serialPart = await SerialPart.findById(serialPartId);
        if (serialPart) {
          const userIsAuthor = serialPart.isAuthor(userId);
          if (userIsAuthor) {
            const edit = await updateSerialPart({
              serialPartId,
              title,
              synopsis,
              content,
            });
            return edit;
          }
        } else {
          return null;
        }
      } else {
        return {
          deletedSerial: null,
          error: "user is not author",
        };
      }
    },
    async deleteSerialPart(parent, { serialPartId }, context) {
      const userId = context.user.id;
      if (userId) {
        const serialPart = await SerialPart.findById(serialPartId);
        if (serialPart) {
          const userIsAuthor = serialPart.isAuthor(userId);
          if (userIsAuthor) {
            const deletion = await removeSerialPart(serialPartId);
            return { resourceName: deletion.title, error: null };
          } else {
            return {
              resorceName: null,
              error: "Unauthorized action, user is not author.",
            };
          }
        } else {
          return { resorceName: null, error: "Serial Part Not Found" };
        }
      } else {
        return {
          deletedSerial: null,
          error: "user is not logged in",
        };
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
