import { Request, Response } from "express";
import { Bid } from "../../models/Bid";

export const deleteBid = async (req: Request, res: Response) => {
    const bidId: number = parseInt(req.params.bidId);

    try {
        await Bid.destroy({ where: { id: bidId } });
        return res.status(200).json({ message: "Bid deleted Successfully!", error: false });
    } catch (e: any) {
        console.log("Error while adding bid", e);

        return res.status(500).json({
            message: e?.message || "An error has occured while adding bid",
            error: true,
        });
    }
};
