require('dotenv').config();
import express from 'express';
import logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser, protectedResolver } from './users/users.utils';
import client from './client';

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return {
      client,
      loggedInUser: await getUser(req.headers.token),
      protectedResolver,
    };
  },
});

const app = express();
app.use(logger('tiny'));
app.use('/static', express.static('uploads'));
apollo.start().then(() => {
  apollo.applyMiddleware({ app });
});
app.listen({ port: PORT }, () => {
  console.log(`🚀 Server is Running on http://localhost:${PORT} ✅`);
});
