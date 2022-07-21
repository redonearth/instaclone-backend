import { gql } from 'apollo-server-express';

export default gql`
  scalar Upload
  type Mutation {
    editProfile(
      name: String
      username: String
      email: String
      password: String
      bio: String
      avatar: Upload
    ): MutationResponse!
  }
`;
