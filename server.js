require('dotenv').config();
import express from 'express';
import logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser, protectResolver } from './users/users.utils';

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      protectResolver,
    };
  },
});

const app = express();
app.use(logger('tiny'));
app.use('/static', express.static('uploads'));
apollo.applyMiddleware({ app });
app.listen({ port: PORT }, () => {
  console.log(`🚀 Server is Running on http://localhost:${PORT} ✅`);
});
