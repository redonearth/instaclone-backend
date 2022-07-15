import { Resolvers } from '../types';

const resolvers: Resolvers = {
  Room: {
    users: ({ id }, _, { client }) =>
      client.room
        .findUnique({
          where: {
            id,
          },
        })
        .users(),
    messages: ({ id }, _, { client }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
      }),
    totalUnread: ({ id }, _, { client, loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
    },
  },
};

export default resolvers;
