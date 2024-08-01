import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import passport from "passport";
import pool from "../db";

if (!process.env.SECTRET) {
    console.error("SECRET is required for Passport JS");
    process.exit(1);
}

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECTRET,
};

passport.use(
    new Strategy(options, async (payload, done) => {
        try {
            const userQuery = await pool.query("SELECT * FROM users WHERE users.id = $1", [
                payload.id,
            ]);
            if (userQuery.rows.length) return done(null, userQuery.rows[0]);
        } catch (e) {
            console.log("Error in passport config");
            return done(e);
        }
    })
);
