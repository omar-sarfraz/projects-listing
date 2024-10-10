import pkg from "pg";
const { Client } = pkg;

import { channels, events, pubsub } from "./utils.js";
import { sequelize } from "./sequelize.js";

const db_name = process.env.DB_NAME;
const username = process.env.DB_USER;
const host = process.env.DB_HOST || "localhost";
const port = parseInt(process.env.BD_PORT || "5432");
const password = process.env.DB_PASSWORD || "";

if (!db_name || !username) {
    console.error("Database name and Username is required!");
    process.exit(1);
}

const db = new Client({
    user: username,
    host,
    database: db_name,
    password,
    port,
});

const setupListeners = async () => {
    await db.query(`LISTEN ${events.BID_UPDATE}`);
    await db.query(`LISTEN ${events.BID_CREATE}`);
};

const setupNotifications = () => {
    db.on("notification", (msg) => {
        const payload = msg.payload ? JSON.parse(msg.payload) : null;

        if (msg.channel === events.BID_UPDATE && payload.acceptedBid) {
            pubsub.publish(channels.BID_UPDATE, {
                bidUpdate: {
                    message: "Your bid has been accepted",
                    type: events.BID_UPDATE,
                    data: payload,
                },
            });
        }

        if (msg.channel === events.BID_CREATE) {
            pubsub.publish(channels.PROJECT_UPDATE, {
                projectUpdate: {
                    message: "A new bid has been added",
                    type: events.BID_CREATE,
                    data: payload,
                },
            });
        }
    });
};

export const setupDatabase = async () => {
    await db.connect();
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync({ alter: true });
    console.log("Models have been synchronized!");

    await setupListeners();
    setupNotifications();
};
