
const { Model } = require('sequelize');
const { createModelInitObj } = require('.');

class SectionData extends Model {
}
const createSectionData = (sequelize, DataTypes) => {
    SectionData.init(
        createModelInitObj(
            {
                companyid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    onDelete: "cascade",
                    references: {
                        model: 'Company',
                        key: 'id',
                    },
                },
                reportid: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    onDelete: "cascade",
                    references: {
                        model: 'Report',
                        key: 'id',
                    },
                },
                sectionname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                key: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                value: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                }
            }, DataTypes),
        {
            sequelize,
            modelName: 'SectionData',
            tableName: 'SectionData',
            freezeTableName: true
        }
    )
    // SectionData.beforeCreate(async (SectionData, options) => {
    //     console.log(SectionData, 'SectionData data');
    // });
}

module.exports = { SectionData, createSectionData };