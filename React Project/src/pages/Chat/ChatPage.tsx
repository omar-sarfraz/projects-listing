import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";

import { useAuth } from "../../contexts/AuthContext";
import { MessageType } from "../../lib/types";

import { Icon } from "@iconify/react";
import { Button, Box, Input, Loader, Blockquote } from "@mantine/core";
import { useToast } from "../../contexts/ToastContext";
import { USER_ROLES } from "../../lib/utils";

const MESSAGES_QUERY = gql`
    query Messages($projectId: Int!) {
        messages(projectId: $projectId) {
            id
            text
            projectId
            userId
        }
    }
`;

const POST_MESSAGE_QUERY = gql`
    mutation ($message: MessageInput!) {
        postMessage(message: $message) {
            id
        }
    }
`;

export default function ChatPage() {
    const params = useParams();
    const { user } = useAuth();
    const { toast } = useToast();

    const [text, setText] = useState("");

    const projectId = parseInt(params.id || "0");

    const { data, error, loading } = useQuery(MESSAGES_QUERY, {
        variables: { projectId },
    });

    const [postMessage, { error: postMessageError, loading: postMessageLoading }] =
        useMutation(POST_MESSAGE_QUERY);

    const handleSend = () => {
        if (!text) return;

        postMessage({
            variables: {
                message: {
                    text,
                    projectId,
                },
            },
        });

        if (postMessageError) toast("An error has occured!", "error");
        else setText("");
    };

    if (!loading && error) return <div>An error has occurred!</div>;

    if (loading)
        return (
            <div className="flex w-full justify-center">
                <Loader />
            </div>
        );

    return (
        <Box pos="relative" className="h-[80vh] flex flex-col justify-between">
            <Blockquote color="blue" mt="xs" py="md">
                Chat with {user?.role === USER_ROLES.client ? "freelancer" : "client"}
            </Blockquote>
            <div>
                <div className="flex flex-col gap-2 py-4 w-full overflow-scroll">
                    {data.messages.map((message: MessageType) => (
                        <div
                            className={`w-full flex ${
                                message.userId === user?.id ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`w-[60%] flex px-2 py-2 rounded-sm ${
                                    message.userId === user?.id
                                        ? "bg-emerald-500 text-white"
                                        : "bg-gray-300"
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex w-full gap-2">
                    <Input
                        placeholder="Type you message"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="grow"
                    />
                    <Button
                        leftSection={<Icon icon="ion:send-sharp" fontSize={14} color="white" />}
                        variant="default"
                        className="bg-emerald-500 text-white"
                        onClick={handleSend}
                        loading={postMessageLoading}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </Box>
    );
}
