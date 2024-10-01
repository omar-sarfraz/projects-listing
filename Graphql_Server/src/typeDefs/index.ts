const typeDefs = `
scalar Date

type Query {
  messages(projectId: Int!, limit: Int!, cursor: Int): [Message]
}

type Mutation {
  postMessage(message: MessageInput!): Message
}

type Message {
  id: Int
  text: String
  projectId: Int
  userId: Int
  createdAt: Date
}

input MessageInput {
  text: String
  projectId: Int
}

type Subscription {
  projectUpdate: Notification
  bidUpdate: Notification
  messageCreated(projectId: Int!): Message
}

type Notification {
  message: String
  type: String
}
`;

export default typeDefs;
