import pkg from "pg";
const { Client } = pkg;

const db_name = process.env.DB_NAME;
const username = process.env.DB_USER;
const host = process.env.DB_HOST || "localhost";
const port = parseInt(process.env.BD_PORT || "5432");

if (!db_name || !username) {
    console.error("Database name and Username is required!");
    process.exit(1);
}

export const db = new Client({
    user: username,
    host: host,
    database: db_name,
    password: "",
    port: port,
});
