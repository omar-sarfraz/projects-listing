import { Bid } from "../../models/Bid";

const getUserBids = async (freelancerId: number | undefined) => {
    if (!freelancerId) return [];
    try {
        const bids = await Bid.findAll({ where: { userId: freelancerId }, attributes: ["id"] });
        const ids = bids.map((bid) => bid.dataValues.id);
        return ids;
    } catch (e: any) {
        console.log("Failed to get bids", e);
        return [];
    }
};

export default getUserBids;
