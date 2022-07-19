require('dotenv').config();
import express, { Express } from 'express';
import logger from 'morgan';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { schema } from './schema';
import { execute, subscribe } from 'graphql';
import { getUser, protectedResolver } from './users/users.utils';
import client from './client';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { createServer, Server } from 'http';
import { WebSocketServer } from 'ws';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { User } from '@prisma/client';

interface ConnectionParams {
  token?: string;
  'content-type'?: string;
}

const startServer = async () => {
  const PORT = process.env.PORT;

  const app: Express = express();
  app.use(logger('tiny'));
  app.use(graphqlUploadExpress());
  app.use('/static', express.static('uploads'));

  const httpServer: Server = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  const subscriptionServer: SubscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: async ({ token }: ConnectionParams) => {
        if (!token) {
          throw new Error("You can't listen.");
        }
        const loggedInUser: User | null = await getUser(token);
        return { loggedInUser };
      },
      onDisconnect: () => {
        console.log('Disconnected!');
      },
    },
    wsServer
  );

  const apollo: ApolloServer<ExpressContext> = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const loggedInUser: User | null = await getUser(req.headers.token);
      return {
        client,
        loggedInUser,
        protectedResolver,
      };
    },
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground,
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await apollo.start();
  apollo.applyMiddleware({ app });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is Running on http://localhost:${PORT} ✅`);
  });
};

startServer();
