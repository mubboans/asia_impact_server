const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class Portfolio extends Model {

}

const createPortfolioModel = (sequelize, DataTypes) => {
    Portfolio.init(
        createModelInitObj( //pass only needed field with datatype
            {
                companyid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "Company",
                        key: "id",
                    },
                },
                userid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "User",
                        key: "id",
                    },
                },
                count: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                price: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                currency: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: 'DRs'
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'Portfolio',
            freezeTableName: true,
        },
    )
};

module.exports = {
    createPortfolioModel, Portfolio
}