import { useState } from "react";

import { Button } from "@mantine/core";
import { Icon } from "@iconify/react";

import { CommentType } from "../lib/types";

import { useAuth } from "../contexts/AuthContext";

import ConfirmationDialog from "./ConfirmationDialog";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export default function SingleComment({
    comment,
    deleteComment,
}: {
    comment: CommentType;
    deleteComment: (_: number) => Promise<void>;
}) {
    const [loadingDelete, setLoadingDelete] = useState(false);

    const { user } = useAuth();

    const handleDelete = async (id: number | undefined) => {
        if (!id) return;
        setLoadingDelete(true);
        await deleteComment(id);
        setLoadingDelete(false);
    };

    return (
        <div key={comment.id} className="bg-gray-100 p-4 rounded-md mb-2">
            <div className="flex justify-between items-center mb-2 py-2 border-b-[1px] border-gray-200">
                <div>{`${comment.user?.firstName} ${comment.user?.lastName}`}</div>
                <div className="flex gap-4 items-center">
                    <div>{dayjs(comment.createdAt).format("LLL")}</div>
                    {comment.user?.id === user?.id && (
                        <ConfirmationDialog
                            onClick={() => handleDelete(comment?.id)}
                            title="Confirm Comment Deletion"
                            description="Do you really want to delete this Comment? This action is irreversible."
                        >
                            <Button
                                type="submit"
                                leftSection={<Icon icon="ion:trash" fontSize={14} color="red" />}
                                variant="outline"
                                color="red"
                                className=" "
                                loading={loadingDelete}
                            >
                                Delete
                            </Button>
                        </ConfirmationDialog>
                    )}
                </div>
            </div>
            <div>{comment.text}</div>
        </div>
    );
}
