import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { encrypt } from "@omar-sarfraz/caesar-cipher";

import pool from "../../db";

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
    const userData: User = req.body;

    if (!userData.email || !userData.firstName || !userData.lastName || !userData.password)
        return res.status(400).json({
            message: "firstName, lastName, email and password is required!",
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

        if (userResponse.rows.length)
            return res
                .status(400)
                .json({ message: "User with this email already exists", error: true });

        const encryptedFirstName = encrypt(key, userData.firstName);
        const encryptedLastName = encrypt(key, userData.lastName);

        const hash = await bcrypt.genSalt(key);
        const encryptedPassword = await bcrypt.hash(userData.password, hash);

        const signUpResponse = await pool.query(
            "INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)",
            [encryptedFirstName, encryptedLastName, encryptedEmail, encryptedPassword]
        );

        if (signUpResponse.rowCount)
            return res.status(200).json({ message: "User added successfully.", error: false });
        else return res.status(400).json({ message: "Failed to add user", error: true });
    } catch (e) {
        console.log("SignUp Error", e);
        return res.status(500).json({ message: "Internal Server Error", error: true });
    }
});

router.post("/login", async (req: Request, res: Response) => {
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

        const existingUser: User = userResponse.rows[0];
        let match = await bcrypt.compare(userData.password, existingUser.password);

        if (!match) {
            return res
                .status(400)
                .json({ message: "Email or password is incorrect!", error: true });
        }
        // TO DO: Create Token and send back
        return res.status(200).json({ message: "Logged in successfully", error: false });
    } catch (e) {
        console.log("Login Error", e);
        return res.status(500).json({ message: "Internal Server Error", error: true });
    }
});

export default router;
