import { Resolvers } from '../../types';

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: async (_, { id, page }, { client }) =>
      await client.comment.findMany({
        where: {
          photoId: id,
        },
        take: 10,
        skip: page ? 1 : 0,
        ...(page && {
          cursor: {
            id: page,
          },
        }),
        orderBy: {
          createdAt: 'desc',
        },
      }),
  },
};

export default resolvers;
