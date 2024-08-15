import { AxiosResponse } from "axios";
import { useToast } from "../contexts/ToastContext";
import axiosInstance from "../lib/axios";
import { Bid, Project } from "../lib/types";
import { Dispatch, SetStateAction } from "react";

export default function BidsList({
    bids,
    canAccept,
    acceptedBid,
    projectId,
    userToken,
    setProject,
}: {
    bids: Bid[];
    canAccept: boolean;
    acceptedBid: number | undefined;
    projectId: number;
    userToken: string | undefined;
    setProject: Dispatch<SetStateAction<Project | undefined>>;
}) {
    const { toast } = useToast();

    const handleAcceptBid = async (id: number) => {
        try {
            const response: AxiosResponse = await axiosInstance.post(
                `/projects/${projectId}/bids/${id}/accept`,
                null,
                { headers: { Authorization: "Bearer " + userToken } }
            );
            const updatedProject: Project = response.data.data;
            console.log(1);
            setProject((project) => {
                if (project) {
                    return { ...project, acceptedBid: updatedProject.acceptedBid };
                }
            });
            console.log(2);
            toast("Bid accepted successfully", "success");
        } catch (e: any) {
            console.log("Accept Bid response", e);
            toast(e?.response?.data?.message || "An error has occurred", "error");
        }
    };

    return (
        <div>
            <h2 className="text-xl underline underline-offset-8 mt-8">Project Bids</h2>
            {bids.map((bid) => (
                <div className="bg-gray-100 p-4 mt-4 rounded-md" key={bid.id}>
                    <div className="flex justify-between">
                        <div className="flex gap-1">
                            Amount:<div className="font-bold">{bid.budget} $</div>
                        </div>
                        <div>{new Date(bid.deadline).toDateString()}</div>
                    </div>
                    <div>{bid.description}</div>
                    {canAccept && (
                        <button
                            className="bg-emerald-500 text-white px-4 py-1 mt-2 rounded-md"
                            onClick={() => handleAcceptBid(bid.id)}
                        >
                            Accept Bid
                        </button>
                    )}
                    {bid.id === acceptedBid && (
                        <div className="bg-emerald-500 text-white px-4 py-1 mt-2 rounded-md text-center">
                            Accepted
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
