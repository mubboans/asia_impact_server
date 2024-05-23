const { Model } = require('sequelize');
class Message extends Model {

}

const createMessageModel = (sequelize, DataTypes) => {

    Message.init(
        //pass only needed field with datatype
        {
            conversationid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Conversation',
                    key: 'id',
                },

            },
            fromUserId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            toUserId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            timestamp: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'Message',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Message, createMessageModel
}