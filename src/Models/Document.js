
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
                    // foreignKey: true,
                    // onDelete: "cascade",
                    // references: {
                    //     model: "User",
                    //     key: "id",
                    // },
                },
                documenturl: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: "Document file url"
                },
                documenttype: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: "Document file type"
                },
                documentname: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    comment: "Document Name to save"
                },
                documentdetail: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    comment: "Document other detail to save"
                },
                remark: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                companyid: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                uboid: {
                    type: DataTypes.INTEGER,
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

module.exports = { Document, createDocument };