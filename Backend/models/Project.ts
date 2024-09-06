import { sequelize } from "../lib/sequelize";
import { DataTypes } from "sequelize";
import { Bid } from "./Bid";
import { events } from "../lib/utils";

export const Project = sequelize.define(
    "project",
    {
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
        files: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
    },
    {
        paranoid: true,
        hooks: {
            afterUpdate: async (project, options) => {
                await sequelize.query(`NOTIFY ${events.BID_UPDATE}, '${JSON.stringify(project)}'`);
            },
        },
    }
);

// Project can have many bids
Project.hasMany(Bid, { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
Bid.belongsTo(Project);

// Project can have 1 accepted bid | Foreign key defined in Project Model
Bid.hasOne(Project, { foreignKey: "acceptedBid" });
Project.belongsTo(Bid, { foreignKey: "acceptedBid" });
