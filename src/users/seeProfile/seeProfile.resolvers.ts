export default {
  Query: {
    seeProfile: (_, { username }, { client, loggedInUser }) =>
      client.user.findUnique({
        where: {
          username,
        },
      }),
  },
};
