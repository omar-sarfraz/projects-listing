import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import passport from "passport";
import { User } from "../models/User";

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
            const record = await User.findOne({ where: { id: payload.id } });
            if (record) return done(null, record.dataValues);
        } catch (e) {
            console.log("Error in passport config");
            return done(e);
        }
    })
);
