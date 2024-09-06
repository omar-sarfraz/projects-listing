import multer from "multer";
import * as fs from "fs";
import { Request, Response, NextFunction } from "express";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderName = req.body.userId;
        const folderPath = `public/${folderName}/${req.body.name}`;

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
                return res
                    .status(400)
                    .json({ message: "You can only upload maximum of 5 files", error: true });
            } else if (err) {
                return res
                    .status(500)
                    .json({ message: "An unexpected error has occured!", error: true });
            }

            next();
        });
    };
