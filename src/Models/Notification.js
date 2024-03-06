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
                    allowNull: true,
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
                message_type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    //Optional field to classify the notification type (e.g., "info", "warning", "alert").
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