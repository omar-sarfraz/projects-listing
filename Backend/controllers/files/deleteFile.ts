import { Request, Response } from "express";

import * as fs from "fs";

export const deleteFiles = async (req: Request, res: Response) => {
    const { path } = req.body;

    if (!path) return res.status(400).json({ message: "Path is required!", error: true });

    try {
        fs.unlink(`public/${path}`, async (err) => {
            if (err)
                return res.status(500).json({
                    message: "An error has occured while deleting file",
                    error: true,
                });

            return res.status(200).json({ message: "File Deleted", error: false });
        });
    } catch (e: any) {
        console.log("Error while deleting file", e);

        return res.status(500).json({
            message: "An error has occured while deleting file",
            error: true,
        });
    }
};
