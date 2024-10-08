import { gql } from "@apollo/client";

export const PROJECT_UPDATES_SUBSCRIPTION = gql`
    subscription {
        projectUpdate {
            message
            type
        }
    }
`;

export const BID_UPDATES_SUBSCRIPTION = gql`
    subscription {
        bidUpdate {
            message
            type
        }
    }
`;

export const MESSAGE_SUBSCRIPTION_QUERY = gql`
    subscription ($projectId: Int!) {
        messageCreated(projectId: $projectId) {
            id
            text
            projectId
            userId
        }
    }
`;

export const MESSAGES_QUERY = gql`
    query Messages($projectId: Int!, $limit: Int!, $cursor: Int) {
        messages(projectId: $projectId, limit: $limit, cursor: $cursor) {
            id
            text
            projectId
            userId
            createdAt
        }
    }
`;

export const POST_MESSAGE_QUERY = gql`
    mutation ($message: MessageInput!) {
        postMessage(message: $message) {
            id
            text
            projectId
            userId
        }
    }
`;
