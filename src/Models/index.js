const { getCurrentFormatedDate } = require("../utils/functionalHelper")
const moment = require("moment");
const createModelInitObj = (obj, DataTypes) => {
    let d = {
        ...obj,
        lastUsedIp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            // foreignKey: true,
            // onDelete: "cascade",
            // references: {
            //     model: "User",
            //     key: "id",
            // },
        },
        lastUpdateDate: {
            type: DataTypes.STRING,
            defaultValue: () => getCurrentFormatedDate(),
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            // foreignKey: true,
            // onDelete: "cascade",
            // references: {
            //     model: "User",
            //     key: "id",
            // },
        },
        createdOn: {
            type: DataTypes.STRING,
            defaultValue: () => getCurrentFormatedDate(),
        },
        deletionDate: {
            type: DataTypes.STRING,
            allowNull: true
            // defaultValue: DataTypes.DATE
        },
        deletedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            // foreignKey: true,
            // onDelete: "cascade",
            // references: {
            //     model: "User",
            //     key: "id",
            // },
        },
    }

    return d;
}

module.exports = { createModelInitObj }