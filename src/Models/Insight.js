const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class Insight extends Model {

}

const createInsightModel = (sequelize, DataTypes) => {
    Insight.init(
        createModelInitObj(
            {
                headline: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    // sender id
                },
                insightDate: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                insightcode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                lang_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                isNew: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true
                },
                tag: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    //Optional field to classify the Insight type (e.g., "info", "warning", "alert").
                },
                file_url: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                file_type: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                file_name: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'Insight',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Insight, createInsightModel
}