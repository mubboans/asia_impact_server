
const { Model } = require('sequelize');
const { createModelInitObj } = require('.');

class CompanyNSustain extends Model {
}
const createCompanyNSustain = (sequelize, DataTypes) => {
    CompanyNSustain.init(
        createModelInitObj(
            {
                companyid: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "Company",
                        key: "id",
                    },
                },
                sustaingoalid: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "SustainGoal",
                        key: "id",
                    },
                },
                // reportid: {
                //     type: DataTypes.INTEGER,
                //     allowNull: true,
                //     foreignKey: true,
                //     onDelete: "cascade",
                //     references: {
                //         model: "Report",
                //         key: "id",
                //     },
                // },
            }, DataTypes),
        {
            sequelize,
            modelName: 'CompanyNSustain',
            tableName: 'CompanyNSustain',
            freezeTableName: true
        }
    )

}

console.log('Documents exported');
module.exports = { CompanyNSustain, createCompanyNSustain };