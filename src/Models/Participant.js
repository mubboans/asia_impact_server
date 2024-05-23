const { Model } = require('sequelize');
class Participate extends Model {

}

const createParticipateModel = (sequelize, DataTypes) => {

    Participate.init(
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
            }
        },
        {
            sequelize,
            modelName: 'Participate',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Participate, createParticipateModel
}