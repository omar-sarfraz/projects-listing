import { sequelize } from "../lib/sequelize";
import { DataTypes } from "sequelize";
import { USER_ROLES } from "../lib/utils";
import { Project } from "./Project";
import { Bid } from "./Bid";
import { decrypt } from "@omar-sarfraz/caesar-cipher";

const key = parseInt(process.env.PORT || "0");

export const User = sequelize.define("user", {
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
        get() {
            return decrypt(key, this.dataValues.email);
        },
    },
    password: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(),
        values: [USER_ROLES.freelancer, USER_ROLES.client],
        allowNull: false,
    },
});

// User can have many project
User.hasMany(Project, { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
Project.belongsTo(User);

// User can have many bids
User.hasMany(Bid, { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
Bid.belongsTo(User);
