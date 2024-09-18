import { useEffect, useState } from "react";

import { AxiosResponse } from "axios";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

import useAxios from "../hooks/useAxios";
import { User } from "../lib/types";

type CommentType = {
    id: string;
    text: string;
    projectId: number;
    userId: number;
    createdAt: string;
    user: User;
};

export default function Comments({ projectId }: { projectId: number }) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);

    const axiosInstance = useAxios();

    const url = `/projects/${projectId}/comments`;

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response: AxiosResponse = await axiosInstance.get(url);
            setComments(response.data.data);
        } catch (e: any) {
            console.log("Error occured in fetchComments", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading</div>;

    if (!comments.length) return <div className="mt-8">No comments found!</div>;

    return (
        <div className="my-8">
            <h2 className="text-xl italic underline underline-offset-8 mb-4">Comments</h2>
            {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-100 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2 py-2 border-b-[1px] border-gray-200">
                        <div>{`${comment.user.firstName} ${comment.user.lastName}`}</div>
                        <div>{dayjs(comment.createdAt).format("LLL")}</div>
                    </div>
                    <div>{comment.text}</div>
                </div>
            ))}
        </div>
    );
}
