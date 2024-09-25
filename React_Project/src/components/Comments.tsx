import { useState } from "react";

import { Icon } from "@iconify/react";
import { Button, Input } from "@mantine/core";
import { useInViewport } from "@mantine/hooks";

import CommentsList from "./CommentsList";
import useComments from "../hooks/useComments";

export default function Comments({ projectId }: { projectId: number }) {
    const { ref, inViewport } = useInViewport();

    const [text, setText] = useState("");

    const { comments, loadingComments, loadingSubmit, postComment, deleteComment } = useComments(
        projectId,
        inViewport
    );

    const handleAddComment = () => {
        postComment(text);
    };

    return (
        <div className="my-8" ref={ref}>
            <h2 className="text-xl italic underline underline-offset-8 mb-4">Comments</h2>
            <form className="flex w-full gap-2 mb-4" onSubmit={handleAddComment}>
                <Input
                    placeholder="Type you comment"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="grow"
                />
                <Button
                    type="submit"
                    leftSection={<Icon icon="ion:add-circle" fontSize={18} color="white" />}
                    variant="default"
                    className="bg-emerald-500 text-white"
                    onClick={handleAddComment}
                    loading={loadingSubmit}
                >
                    Comment
                </Button>
            </form>
            <CommentsList
                comments={comments}
                loading={loadingComments}
                deleteComment={deleteComment}
            />
        </div>
    );
}
