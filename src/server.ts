require('dotenv').config();
import express from 'express';
import logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
import { getUser, protectedResolver } from './users/users.utils';
import client from './client';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
const serverCleanup = useServer({ schema }, wsServer);

const apollo = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      client,
      loggedInUser: await getUser(req.headers.token),
      protectedResolver,
    };
  },
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

app.use(logger('tiny'));
app.use('/static', express.static('uploads'));
app.use(graphqlUploadExpress());
apollo.start().then(() => {
  apollo.applyMiddleware({ app });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is Running on http://localhost:${PORT} ✅`);
});
