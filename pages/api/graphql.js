import { ApolloServer, gql } from "apollo-server-micro";
import { getSerials } from "../../actions/serial";
import { getUsers } from "../../actions/user";

const typeDefs = gql`
  type Query {
    users: [User!]!
    serials: [Serial]
  }
  type User {
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
`;

const resolvers = {
  Query: {
    users(parent, args, context) {
      return getUsers();
    },
    serials(parent, args, context) {
      return getSerials();
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
