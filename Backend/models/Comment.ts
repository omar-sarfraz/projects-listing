import { sequelize } from "../lib/sequelize";
import { DataTypes } from "sequelize";

export const Comment = sequelize.define("comment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});
