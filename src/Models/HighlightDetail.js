
const { Model } = require('sequelize');


const { createModelInitObj } = require('.');


class HighlightDetail extends Model {
}


const createHighlightsOtherDetailModel = (sequelize, DataTypes) => {
    HighlightDetail.init(
        createModelInitObj(
            {
                highlightid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "Highlight",
                        key: "id",
                    },
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                // description: {
                //     type: DataTypes.STRING,
                //     allowNull: true,
                // },
                ordernumber: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                // about: {
                //     type: DataTypes.TEXT,
                //     allowNull: false,
                // },
                type: {
                    type: DataTypes.STRING,
                    allowNull: true
                    //type of data e.g :- itinerary , step to follow
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'HighlightDetail',
            freezeTableName: true,
        },
    )
};



module.exports = {
    HighlightDetail, createHighlightsOtherDetailModel
}