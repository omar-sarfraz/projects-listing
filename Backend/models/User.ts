import { sequelize } from "../lib/sequelize";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
});
