import { Bid } from "../lib/types";

export default function BidsList({ bids, canAccept }: { bids: Bid[]; canAccept: boolean }) {
    const handleAcceptBid = (id: number) => {
        console.log(id);
    };

    return (
        <div>
            <h2 className="text-xl underline underline-offset-8 mt-8">Project Bids</h2>
            {bids.map((bid) => (
                <div className="bg-gray-100 p-4 mt-4 rounded-md">
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
                </div>
            ))}
        </div>
    );
}
