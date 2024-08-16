import { AxiosResponse } from "axios";
import { useToast } from "../contexts/ToastContext";
import axiosInstance from "../lib/axios";
import { Bid, Project } from "../lib/types";
import { Dispatch, SetStateAction } from "react";
import Description from "./Description";
import { useNavigate } from "react-router-dom";

type PropType = {
    bids: Bid[];
    canAccept: boolean;
    acceptedBid: number | undefined;
    projectId: number;
    userToken: string | undefined;
    setProject: Dispatch<SetStateAction<Project | undefined>>;
};

export default function BidsList({
    bids,
    canAccept,
    acceptedBid,
    projectId,
    userToken,
    setProject,
}: PropType) {
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleAcceptBid = async (id: number) => {
        try {
            const response: AxiosResponse = await axiosInstance.post(
                `/projects/${projectId}/bids/${id}/accept`,
                null,
                { headers: { Authorization: "Bearer " + userToken } }
            );

            const updatedProject: Project = response.data.data;
            setProject((project) => {
                if (project) {
                    return { ...project, acceptedBid: updatedProject.acceptedBid };
                }
            });
            toast("Bid accepted successfully", "success");
        } catch (e: any) {
            console.log("Accept Bid response", e);
            toast(e?.response?.data?.message || "An error has occurred", "error");
        }
    };

    const handleDeleteBid = async (id: number) => {
        try {
            const response: AxiosResponse = await axiosInstance.delete(
                `/projects/${projectId}/bids/${id}`,
                { headers: { Authorization: "Bearer " + userToken } }
            );
            toast(response.data.message, "success");
            setProject((project) => {
                if (project && project.bids?.length) {
                    let newBids = project.bids.filter((bid) => bid.id !== id);
                    return { ...project, bids: newBids };
                }
            });
            navigate("/projects/" + projectId);
        } catch (e: any) {
            console.log("Delete bid response", e);
            toast(e?.response?.data?.message || "An error has occurred", "error");
        }
    };

    return (
        <div>
            <h2 className="text-xl underline underline-offset-8 mt-8">Project Bids</h2>
            {bids.map((bid) => (
                <div className="bg-gray-100 p-4 mt-4 rounded-md" key={bid.id}>
                    <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-2 mb-3">
                        <div>Freelancer: {bid.user?.firstName + " " + bid.user?.lastName}</div>
                        <button
                            className="bg-red-50 border-red-500 border-[1px] text-red-500 rounded-md px-4 py-1"
                            onClick={() => handleDeleteBid(bid.id)}
                        >
                            Delete
                        </button>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-1">
                            Amount:<div className="font-bold">{bid.budget} $</div>
                        </div>
                        <div className="flex gap-1">
                            Given deadline:
                            <div className="font-bold">{new Date(bid.deadline).toDateString()}</div>
                        </div>
                    </div>
                    <div className="border-b-[1px] border-gray-200 pb-2 mb-3 mt-3">
                        <Description description={bid.description} />
                    </div>
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
