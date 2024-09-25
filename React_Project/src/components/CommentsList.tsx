import { memo } from "react";

import { CommentType } from "../lib/types";

import SingleComment from "./SingleComment";

function CommentsList({
    loading,
    comments,
    deleteComment,
}: {
    loading: boolean;
    comments: CommentType[];
    deleteComment: (_: number) => Promise<void>;
}) {
    if (loading) return <div>Loading</div>;

    if (!comments.length) return <div className="mt-8">No comments found!</div>;

    return (
        <>
            {comments.map((comment) => (
                <SingleComment comment={comment} deleteComment={deleteComment} />
            ))}
        </>
    );
}

export default memo(CommentsList);
