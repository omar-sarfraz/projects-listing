import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { Icon } from "@iconify/react";
import { Button, Box, Input, Loader, Blockquote } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";

import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

import { MessageType } from "../../lib/types";
import { USER_ROLES } from "../../lib/utils";

import { useMessageSubscription } from "../../hooks/useSubscription";
import { MESSAGES_QUERY, POST_MESSAGE_QUERY } from "../../graphql/queries";

import Message from "../../components/Message";

const MESSAGE_LIMIT = 13;

export default function ChatPage() {
    const params = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [text, setText] = useState("");
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [loadingPrevious, setLoadingPrevious] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const listRef = useRef<HTMLDivElement>(null);

    const projectId = parseInt(params.id || "0");

    useDocumentTitle("Chat");

    useLayoutEffect(() => {
        if (state?.projectOwner !== user?.id && state?.bidOwner !== user?.id) {
            toast("You are not allowed to access this page", "error");
            navigate("/");
        }
    }, []);

    const { data, error, loading, fetchMore } = useQuery(MESSAGES_QUERY, {
        variables: { projectId, limit: MESSAGE_LIMIT },
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
            setMessages((prev) => [postMessageData.postMessage, ...prev]);
        }
    }, [postMessageLoading, postMessageData]);

    const handleScroll = async () => {
        if (!listRef.current || loadingPrevious || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        if (scrollTop + scrollHeight === clientHeight) {
            setLoadingPrevious(true);

            const lastMessageId = messages[messages.length - 1]?.id;
            const { data: moreMessages } = await fetchMore({
                variables: {
                    projectId,
                    cursor: lastMessageId,
                    limit: MESSAGE_LIMIT,
                },
            });

            if (moreMessages?.messages.length) {
                setMessages((prev) => [...prev, ...moreMessages.messages]);
            } else {
                setHasMore(false);
            }

            setLoadingPrevious(false);
        }
    };

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
            <div className="relative">
                {loadingPrevious && (
                    <div className="absolute left-[50%] top-3">
                        <Loader />
                    </div>
                )}
                <div
                    className="flex flex-col-reverse gap-2 pb-4 my-4 w-full overflow-scroll h-[60vh] pt-10"
                    ref={listRef}
                    onScroll={handleScroll}
                >
                    {messages.map((message: MessageType) => (
                        <Message message={message} userId={user?.id} key={message.id} />
                    ))}
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
