const { Model } = require('sequelize');
class Conversation extends Model {

}

const createConversationModel = (sequelize, DataTypes) => {

    Conversation.init(
        //pass only needed field with datatype
        {
            startdate: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isEnded: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            enddate: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Conversation',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Conversation, createConversationModel
}