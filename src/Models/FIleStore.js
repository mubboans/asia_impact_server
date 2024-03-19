
const { Model } = require('sequelize');
const { createModelInitObj } = require('.');

class FileStore extends Model {
}
const createFileStore = (sequelize, DataTypes) => {
    // (sequelize) => {
    //     return sequelize.define('FileStore', 
    FileStore.init(
        createModelInitObj(
            {
                userid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                fileurl: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                filename: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    //  "FileStore stored typed"
                },
                filetype: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    // comment: "FileStore type to save"
                },
                filesize: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    // comment: "FileStore size if any"
                },
            }, DataTypes),
        {
            sequelize,
            modelName: 'FileStore',
            tableName: 'FileStore',
            freezeTableName: true
        }
    )
    // FileStore.beforeCreate(async (FileStore, options) => {
    //     console.log(FileStore, 'FileStore data');
    // });
}

module.exports = { FileStore, createFileStore };