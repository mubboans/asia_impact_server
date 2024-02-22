
const { Model } = require('sequelize');
const { User } = require("./Users");
const { getCurrentFormatedDate } = require("../utils/functionalHelper");
const { createModelInitObj } = require('.');

class Document extends Model {
}
const createDocument = (sequelize, DataTypes) => {
    // (sequelize) => {
    //     return sequelize.define('Document', 
    Document.init(
        createModelInitObj(
            {
                userid: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "User",
                        key: "id",
                    },
                },
                documenturl: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                documenttype: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                documentname: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                documentdetail: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                remark: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            }, DataTypes),
        {
            sequelize,
            modelName: 'Document',
            tableName: 'Document',
            freezeTableName: true
        }
    )
    Document.beforeCreate(async (document, options) => {
        console.log(document, 'document data');
    });
}

console.log('Documents exported');
module.exports = { Document, createDocument };