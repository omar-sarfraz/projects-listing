const typeDefs = `
type Query {
  _empty: Int
}

type Subscription {
  projectUpdate(projectIds: [Int!]!): Notification
  bidUpdate(bidIds: [Int!]!): Notification
}

type Notification {
  message: String
  type: String
}
`;

export default typeDefs;
