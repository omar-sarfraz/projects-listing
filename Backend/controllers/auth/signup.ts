import { Request, Response } from "express";
import { encrypt } from "@omar-sarfraz/caesar-cipher";
import bcrypt from "bcrypt";

import { UserType } from "../../lib/types";
import { User } from "../../models/User";
import { signUpSchema } from "../../validation/User";
import { createJoiError } from "../../lib/utils";

const signup = async (req: Request, res: Response) => {
    try {
        const userData: UserType = await signUpSchema.validateAsync(req.body);
        const key: number = parseInt(process.env.KEY || "");
        if (!key) {
            console.error("Key is required!");
            process.exit(1);
        }

        const encryptedEmail = encrypt(key, userData.email);

        const existingUser = await User.findOne({ where: { email: encryptedEmail } });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists", error: true });
        }

        const hash = await bcrypt.genSalt(key);
        const encryptedPassword = await bcrypt.hash(userData.password, hash);

        const user = await User.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: encryptedEmail,
            password: encryptedPassword,
            role: userData.role,
        });

        if (user)
            return res.status(200).json({ message: "User added successfully.", error: false });
        else return res.status(400).json({ message: "Failed to add user", error: true });
    } catch (e) {
        console.log("SignUp Error", e);
        return res
            .status(500)
            .json({ message: createJoiError(e) || "Internal Server Error", error: true });
    }
};

export default signup;
