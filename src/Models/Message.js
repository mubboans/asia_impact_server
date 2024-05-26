const { Model } = require('sequelize');
class Message extends Model {

}

const createMessageModel = (sequelize, DataTypes) => {

    Message.init(
        //pass only needed field with datatype
        {
            conversation_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Conversation',
                    key: 'id',
                },
            },
            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            // toUserId: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false,
            //     references: {
            //         model: 'User',
            //         key: 'id',
            //     },
            // },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            timestamp: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true,
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