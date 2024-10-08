import { Request, Response } from "express";

export const addFiles = (req: Request, res: Response) => {
    if (!req.files) return res.status(400).json({ message: "No files given", error: true });

    const files = req.files as Express.Multer.File[];
    const paths = files.map((file) => {
        let path = file.path;
        let firstSlash = path.indexOf("/");
        return path.slice(firstSlash + 1);
    });
    return res.status(200).json({ data: paths, error: false });
};
