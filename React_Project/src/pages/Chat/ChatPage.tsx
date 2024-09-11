import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { Icon } from "@iconify/react";
import { Button, Box, Input, Loader, Blockquote } from "@mantine/core";

import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

import { MessageType } from "../../lib/types";
import { USER_ROLES } from "../../lib/utils";

import { useMessageSubscription } from "../../hooks/useSubscription";
import { MESSAGES_QUERY, POST_MESSAGE_QUERY } from "../../graphql/queries";

import Message from "../../components/Message";

export default function ChatPage() {
    const params = useParams();
    const { user } = useAuth();
    const { toast } = useToast();

    const [text, setText] = useState("");
    const [messages, setMessages] = useState<MessageType[]>([]);

    const endRef = useRef<null | HTMLDivElement>(null);

    const projectId = parseInt(params.id || "0");

    const { data, error, loading } = useQuery(MESSAGES_QUERY, {
        variables: { projectId },
    });

    useEffect(() => {
        if (data?.messages.length && !loading) setMessages(data.messages);
    }, [data]);

    const [
        postMessage,
        { data: postMessageData, error: postMessageError, loading: postMessageLoading },
    ] = useMutation(POST_MESSAGE_QUERY);

    useMessageSubscription(projectId, setMessages);

    const handleSend = async () => {
        if (!text) return;

        await postMessage({
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

    useEffect(() => {
        if (!postMessageLoading && postMessageData) {
            setMessages((prev) => [...prev, postMessageData.postMessage]);
        }
    }, [postMessageLoading, postMessageData]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!loading && error) return <div>An error has occurred!</div>;

    if (loading)
        return (
            <div className="flex w-full justify-center">
                <Loader />
            </div>
        );

    return (
        <Box pos="relative" className="flex flex-col justify-between">
            <Blockquote color="blue" mt="xs" py="md">
                Chat with {user?.role === USER_ROLES.client ? "freelancer" : "client"}
            </Blockquote>
            <div>
                <div className="flex flex-col gap-2 py-4 my-4 w-full overflow-scroll h-[60vh]">
                    {messages.map((message: MessageType) => (
                        <Message message={message} userId={user?.id} key={message.id} />
                    ))}
                    <div ref={endRef}></div>
                </div>
                <form className="flex w-full gap-2" onSubmit={handleSend}>
                    <Input
                        placeholder="Type you message"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="grow"
                    />
                    <Button
                        type="submit"
                        leftSection={<Icon icon="ion:send-sharp" fontSize={14} color="white" />}
                        variant="default"
                        className="bg-emerald-500 text-white"
                        onClick={handleSend}
                        loading={postMessageLoading}
                    >
                        Send
                    </Button>
                </form>
            </div>
        </Box>
    );
}
