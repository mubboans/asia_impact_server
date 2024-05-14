const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class DeviceDetail extends Model {

}

const createDeviceDetailModel = (sequelize, DataTypes) => {
    DeviceDetail.init(
        createModelInitObj( //pass only needed field with datatype
            {
                userAgent: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                deviceId: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                screenWidthResolution: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                screenHeightResolution: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                language: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                timeZone: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                deviceType: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    // related to device specific
                },
                deviceOrientation: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                connectionType: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                deviceMemory: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                cpuCores: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                userid: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "User",
                        key: "id",
                    },
                },
                token: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'DeviceDetail',
            freezeTableName: true,
        },
    )
};

module.exports = {
    createDeviceDetailModel, DeviceDetail
}