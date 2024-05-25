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
                investorId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'User',
                        key: 'id',
                    },
                },
                viewChat: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
                participateinChat: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
                expressInterest: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
                viewPortfolio: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
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