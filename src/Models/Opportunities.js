const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class Opportunity extends Model {

}

const createOpportunityModel = (sequelize, DataTypes) => {
    Opportunity.init(
        createModelInitObj(
            {
                activebidno: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                ebitda: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                turnover: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                noofdr: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                priceperdr: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                
                bidprice: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                langid: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                opportunitycode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
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
                isNew: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'Opportunity',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Opportunity, createOpportunityModel
}