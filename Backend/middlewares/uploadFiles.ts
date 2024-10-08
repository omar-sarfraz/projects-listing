import { Request, Response, NextFunction } from "express";
import multer from "multer";
import * as fs from "fs";

import { CustomRequest } from "../lib/types";

const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        const userRequest = req as CustomRequest;

        const folderName = userRequest.user.id;

        if (!folderName) {
            const error = new Error("User Id is required!");
            cb(error, "");
            return;
        }

        const folderPath = `public/${folderName}`;

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        let fileName = file.originalname.split(".")[0];
        let extension = file.originalname.split(".")[1];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

export const uploadFile =
    (fieldName: string, maxFile: number) => (req: Request, res: Response, next: NextFunction) => {
        const upload = multer({ storage }).array(fieldName, maxFile);

        upload(req, res, function (err) {
            if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({
                    message: `You can only upload maximum of ${maxFile} files`,
                    error: true,
                });
            } else if (err) {
                return res.status(500).json({
                    message: err.message || "An unexpected error has occured!",
                    error: true,
                });
            }

            next();
        });
    };
