import { gql } from 'apollo-server-express';

export default gql`
  type Mutation {
    createAccount(
      name: String!
      username: String!
      email: String!
      password: String!
    ): MutationResponse!
  }
`;
