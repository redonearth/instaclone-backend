import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    seeProfile: (_, { username }, { client, loggedInUser }) =>
      client.user.findUnique({
        where: {
          username,
        },
      }),
  },
};

export default resolvers;
