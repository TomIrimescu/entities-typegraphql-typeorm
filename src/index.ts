import { createConnection } from "typeorm";
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";

import { BookResolver } from "./resolvers/BookResolver";

require("dotenv").config();

async function main() {
  await createConnection();
  const schema = await buildSchema({ resolvers: [BookResolver] });
  const server = new ApolloServer({ schema });

  const app = express();
  const router = express.Router();
  server.applyMiddleware({
    app,
    cors: true,
  });

  app.use(express.json());

  app.use(router);
  router.get("/", (req, res, next) => {
    res.send("Hello from Express Router");
  });

  await app.listen({ port: process.env.SERVER_PORT }, () => {
    console.log(
      `GraphQl endpoint found at http://localhost:${process.env.SERVER_PORT}${server.graphqlPath}`
    );
  });
}

main();
