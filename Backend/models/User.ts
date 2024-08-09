import { sequelize } from "../lib/sequelize";
import { DataTypes } from "sequelize";
import { USER_ROLES } from "../lib/utils";

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
        values: [USER_ROLES.freelancer, USER_ROLES.clint],
        allowNull: false,
    },
});
