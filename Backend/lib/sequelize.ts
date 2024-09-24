import { Sequelize } from "sequelize";

const db_name = process.env.DB_NAME;
const username = process.env.DB_USER;
const host = process.env.DB_HOST || "localhost";
const port = parseInt(process.env.DB_PORT || "5432");
const password = process.env.DB_PASSWORD || "";

if (!db_name || !username) {
    console.error("Database name and Username is required!");
    process.exit(1);
}

export const sequelize = new Sequelize(db_name, username, password, {
    host,
    port,
    dialect: "postgres",
    logging: false,
});
