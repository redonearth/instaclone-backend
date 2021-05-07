require('dotenv').config();
import { ApolloServer } from 'apollo-server';
import schema from './schema';

const PORT = process.env.PORT;
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return {
      token: req.headers.token,
    };
  },
});
server
  .listen(PORT)
  .then(() =>
    console.log(`🚀 Server is Running on http://localhost:${PORT} ✅`)
  );
