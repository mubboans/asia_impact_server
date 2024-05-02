const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class Setting extends Model {

}

const createSettingModel = (sequelize, DataTypes) => {
    Setting.init(
        createModelInitObj(
            {
                advisorId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'User',
                        key: 'id',
                    },
                },
                userid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                viewChat: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },
                participateinChat: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },
                expressInterest: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },
                viewPortfolio: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'Setting',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Setting, createSettingModel
}