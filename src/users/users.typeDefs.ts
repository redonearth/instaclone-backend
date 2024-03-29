import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id: Int!
    name: String!
    username: String!
    email: String!
    bio: String
    avatar: String
    photos: [Photo]
    createdAt: String!
    updatedAt: String!
    following: [User]
    followers: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    isMe: Boolean!
    isFollowing: Boolean!
  }
`;
