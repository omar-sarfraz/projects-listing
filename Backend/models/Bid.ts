import { sequelize } from "../lib/sequelize";
import { DataTypes } from "sequelize";
import { events } from "../lib/utils";

export const Bid = sequelize.define(
    "bid",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
    },
    {
        hooks: {
            afterCreate: async (bid, options) => {
                await sequelize.query(`NOTIFY ${events.BID_CREATE}, '${JSON.stringify(bid)}'`);
            },

            afterUpdate: async (bid, options) => {
                await sequelize.query(`NOTIFY ${events.BID_UPDATE}, '${JSON.stringify(bid)}'`);
            },
        },
    }
);
