const express = require("express");
const serverless = require("serverless-http");
const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "world"
  }
};

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  path: "/graphql"
});

(async () => {
  await server.start()
  server.applyMiddleware({ app });
})();

module.exports = {
  app,
  handler: serverless(app)
}
