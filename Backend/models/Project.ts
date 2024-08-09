import { sequelize } from "../lib/sequelize";
import { DataTypes } from "sequelize";

export const Project = sequelize.define("Project", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    budget: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});
