import { Link } from "react-router-dom";

import { Bid } from "../lib/types";

import Description from "./Description";
import ConfirmationDialog from "./ConfirmationDialog";

type PropType = {
    bids: Bid[];
    canAccept: boolean;
    acceptedBid: number | undefined;
    isFreelancer: boolean;
    handleAcceptBid: (id: number) => void;
    handleDeleteBid: (id: number) => void;
    projectOwner: number | undefined;
};

export default function BidsList({
    bids,
    canAccept,
    acceptedBid,
    isFreelancer,
    handleAcceptBid,
    handleDeleteBid,
    projectOwner,
}: PropType) {
    return (
        <div>
            <h2 className="text-xl underline underline-offset-8 mt-8">Project Bids</h2>
            {bids.map((bid) => (
                <div className="bg-gray-100 p-4 mt-4 rounded-md" key={bid.id}>
                    <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-2 mb-3">
                        <div>Freelancer: {bid.user?.firstName + " " + bid.user?.lastName}</div>
                        {isFreelancer ? (
                            <div className="flex gap-2">
                                <Link
                                    className="bg-emerald-50 border-emerald-600 border-[1px] text-emerald-600 rounded-md px-4 py-1"
                                    to={`/projects/${bid?.projectId}/bid`}
                                    state={bid}
                                >
                                    Edit
                                </Link>
                                <ConfirmationDialog
                                    onClick={() => handleDeleteBid(bid.id)}
                                    title="Confirm Bid Deletion"
                                    description="Do you really want to delete this bid? This action is irreversible."
                                >
                                    <button className="bg-red-50 border-red-500 border-[1px] text-red-500 rounded-md px-4 py-1">
                                        Delete
                                    </button>
                                </ConfirmationDialog>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex justify-between flex-col sm:flex-row">
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
                        <Link
                            to={`/projects/${bid?.projectId}/chat`}
                            state={{ projectOwner, bidOwner: bid.user?.id }}
                            className="bg-emerald-500 text-white px-4 py-1 mt-2 rounded-md text-center"
                        >
                            Bid Accepted: Chat Now
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
}
