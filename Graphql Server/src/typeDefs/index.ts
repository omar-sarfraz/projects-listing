const typeDefs = `
type Query {
  messages(projectId: Int!): [Message]
}

type Mutation {
  postMessage(message: MessageInput!): Message
}

type Message {
  id: Int
  text: String
  projectId: Int
  userId: Int
}

input MessageInput {
  text: String
  projectId: Int
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
