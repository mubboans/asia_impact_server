const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class ActiveChatRequest extends Model {

}

const createActiveChatRequestModel = (sequelize, DataTypes) => {
    ActiveChatRequest.init(
        createModelInitObj( //pass only needed field with datatype
            {
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
                ai_officer_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    // type of user initiated the request eg: Advisor , Investor
                },
                ai_officer_message: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                ai_officer_request_raised_by: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                ai_officer_status: {
                    type: DataTypes.STRING, // pending,approved,declined
                    allowNull: true
                },
                lang_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                request_replied_on: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                is_read: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                request_status: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: 'pending' // accepted,rejected,closed
                },
                // status: {
                //     type: DataTypes.STRING,
                //     allowNull: true,
                //     defaultValue: 'outgoing' // ['outgoing','incomming',pending']
                // },
                chat_closed_on: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                chat_closed_by: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'ActiveChatRequest',
            freezeTableName: true,
        },
    )
};

module.exports = {
    ActiveChatRequest, createActiveChatRequestModel
}