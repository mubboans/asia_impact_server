const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class Notification extends Model {

}

const createNotificationModel = (sequelize, DataTypes) => {
    Notification.init(
        createModelInitObj(
            {
                sender_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    // sender id
                },
                receiver_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                notificationcode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                lang_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                message: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: 'warning'
                },
                redirectlink: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                is_read: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                },
                otherdetail: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                isNew: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true
                },
                company_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                notificationtype: {
                    type: DataTypes.ENUM,
                    values: ['approval', 'message'], // Add other types if needed
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'Notification',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Notification, createNotificationModel
}