export const userdef = `
  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(user: NewUserInput!): User
    deleteUser(id: ID!): Boolean
    updateUser(id: ID!, update: UpdateUserInput!): User
  }

  input NewUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    comments: [Comment]
  }
`;
