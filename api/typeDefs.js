import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
  }
  type Query {
    currentUser: User
  }
  type AuthPayload {
    user: User
  }
  type Mutation {
    signup(firstName: String!, lastName: String!, email: String!, password: String!): AuthPayload
  }
  type Mutation {
    login(email: String!, password: String!): AuthPayload
  }
  type Mutation {
    logout: Boolean
  }
`;

export default typeDefs;
