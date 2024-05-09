const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class ActiveChatRequestHistory extends Model {

}

const createActiveChatRequestHistoryModel = (sequelize, DataTypes) => {
    ActiveChatRequestHistory.init(
        createModelInitObj( //pass only needed field with datatype
            {
                companyid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "Company",
                        key: "id",
                    },
                },
                activerequestid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "ActiveRequest",
                        key: "id",
                    },
                },
                activechatrequestid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "ActiveChatRequest",
                        key: "id",
                    },
                },
                sender_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "User",
                        key: "id",
                    },
                },
                receiver_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "User",
                        key: "id",
                    },
                },
                message: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                severity: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: "warning"
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                is_read: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                },
                readBy: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                lang_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                // status: {
                //     type: DataTypes.STRING,
                //     allowNull: true
                // },
                type: {
                    type: DataTypes.STRING,
                    defaultValue: "activechatrequesthistory"
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'ActiveChatRequestHistory',
            freezeTableName: true,
        },
    )
};

module.exports = {
    ActiveChatRequestHistory, createActiveChatRequestHistoryModel
}