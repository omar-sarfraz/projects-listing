import { Request, Response } from "express";
import { encrypt, decrypt } from "@omar-sarfraz/caesar-cipher";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import pool from "../../db";
import { User } from "../../routes/auth/auth";

const login = async (req: Request, res: Response) => {
    const userData = req.body;

    if (!userData.email || !userData.password)
        return res.status(400).json({
            message: "email and password is required!",
            error: true,
        });

    try {
        const key: number = parseInt(process.env.KEY || "");
        if (!key) {
            console.error("Key is required!");
            process.exit(1);
        }

        const encryptedEmail = encrypt(key, userData.email);

        const userResponse = await pool.query("SELECT * FROM users WHERE email = $1;", [
            encryptedEmail,
        ]);

        if (!userResponse.rows.length) {
            return res
                .status(400)
                .json({ message: "Email or password is incorrect!", error: true });
        }

        const existingUser = userResponse.rows[0];
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
            firstName: decrypt(key, existingUser.firstname),
            lastName: decrypt(key, existingUser.lastname),
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
        return res.status(500).json({ message: "Internal Server Error", error: true });
    }
};

export default login;
