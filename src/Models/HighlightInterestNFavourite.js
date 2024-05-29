const { Model } = require('sequelize');
const { createModelInitObj } = require('.');
class HighlightInterestNFavourite extends Model {
}

const createHighlightInterestNFavourite = (sequelize, DataTypes) => {
    HighlightInterestNFavourite.init(
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
                userid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'User',
                        key: 'id',
                    },
                },

                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'HighlightInterestNFavourite',
            freezeTableName: true,
        },
    )
};



module.exports = {
    HighlightInterestNFavourite, createHighlightInterestNFavourite
}