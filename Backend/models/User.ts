import { sequelize } from "../lib/sequelize";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING(),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(),
        values: ["FREELANCER", "CLIENT"],
        allowNull: false,
    },
});
