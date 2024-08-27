import { Request, Response } from "express";
import { encrypt, decrypt } from "@omar-sarfraz/caesar-cipher";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserType } from "../../lib/types";
import { User } from "../../models/User";
import { loginSchema } from "./validationSchema";
import { createJoiError } from "../../lib/utils";

const login = async (req: Request, res: Response) => {
    try {
        const userData = await loginSchema.validateAsync(req.body);
        const key: number = parseInt(process.env.KEY || "");
        if (!key) {
            console.error("Key is required!");
            process.exit(1);
        }

        const encryptedEmail = encrypt(key, userData.email);

        let existingRecord = await User.findOne({ where: { email: encryptedEmail } });

        if (!existingRecord) {
            return res
                .status(400)
                .json({ message: "Email or password is incorrect!", error: true });
        }

        let existingUser: UserType = existingRecord.dataValues;
        const match = await bcrypt.compare(userData.password, existingUser.password);

        if (!match) {
            return res
                .status(400)
                .json({ message: "Email or password is incorrect!", error: true });
        }

        const secret = process.env.SECTRET;
        if (!secret) {
            console.error("JWT Secret is required!");
            process.exit(1);
        }

        const userToSend = {
            id: existingUser.id,
            email: decrypt(key, existingUser.email),
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            role: existingUser.role,
        };

        const token = jwt.sign(
            {
                ...userToSend,
            },
            secret
        );

        return res
            .status(200)
            .json({ message: "Logged in successfully", error: false, token, user: userToSend });
    } catch (e) {
        console.log("Login Error", e);
        return res
            .status(500)
            .json({ message: createJoiError(e) || "Internal Server Error", error: true });
    }
};

export default login;
