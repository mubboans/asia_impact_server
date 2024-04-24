
const { Model } = require('sequelize');
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
                    allowNull: false,
                    references: {
                        model: 'User',
                        key: 'id',
                    },
                },
                userdetailid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'UserDetail',
                        key: 'id',
                    },
                },
                lrdetailid: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'LrDetail',
                        key: 'id',
                    },
                },
                documenturl: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                documenttype: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    //  "Document verification type"
                },
                documentsubtype: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    // comment: "Document Name to save"

                },
                expirydate: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    // comment: "Document date if any"
                },
                documentnumber: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    // comment: "Document Number if any e.g Passport number"
                },
                fileType: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                fileName: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                isResidence: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                },
                country: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                zipcode: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                state: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                city: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                street: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                housenumber: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                documentdetail: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    // comment: "Document other detail to save"
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: 'pending'
                }
            }, DataTypes),
        {
            sequelize,
            modelName: 'Document',
            tableName: 'Document',
            freezeTableName: true
        }
    )
    // Document.beforeCreate(async (document, options) => {
    //     console.log(document, 'document data');
    // });
}

module.exports = { Document, createDocument };