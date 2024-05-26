const { Model } = require('sequelize');
class Participate extends Model {

}

const createParticipateModel = (sequelize, DataTypes) => {

    Participate.init(
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
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            last_read_timestamp: {
                type: DataTypes.INTEGER,
                allowNull: true,
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