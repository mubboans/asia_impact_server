const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class Highlight extends Model {
}




const createHighLightsModel = (sequelize, DataTypes) => {
    Highlight.init(
        createModelInitObj(
            {
                eventType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    // online,offline and readonly
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                subtype: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                imageUrl: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                provience: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                country: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                highlightcode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                lang_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                about: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                venue: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                querydetail: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                eventdate: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                eventtime: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                otherdetail: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                isNew: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true
                },
                meeturl: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                targetUser: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                addhome: {
                    type: DataTypes.BOOLEAN,
                    defaulValue: false
                },
                eventendtime: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                access_group: {
                    type: DataTypes.ENUM,
                    values: ['basic', 'intermediate', 'advanced'],
                    allowNull: true
                },
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'Highlight',
            freezeTableName: true,
        },
    )
};



module.exports = {
    Highlight, createHighLightsModel
}