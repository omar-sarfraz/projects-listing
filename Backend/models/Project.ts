import { sequelize } from "../lib/sequelize";
import { DataTypes } from "sequelize";
import { Bid } from "./Bid";

export const Project = sequelize.define("project", {
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

// Project can have many bids
Project.hasMany(Bid, { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
Bid.belongsTo(Project);

// Project can have 1 accepted bid | Foreign key defined in Project Model
Bid.hasOne(Project, { foreignKey: "acceptedBid" });
Project.belongsTo(Bid, { foreignKey: "acceptedBid" });
