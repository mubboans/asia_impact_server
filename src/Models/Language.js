const { Model } = require('sequelize');
const { createModelInitObj } = require('.');

class Language extends Model {

    static associate(models) {
        console.log(this.models, 'models for associate');
    }

}

const createLanguageModel = (sequelize, DataTypes) => {



    Language.init(
        {
            language_type: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: 'Type of language (e.g., spoken, programming)',
            },
            language_code: {
                type: DataTypes.STRING,
                allowNull: false,
                // unique: true,
                comment: 'Language code following ISO 639-1 or ISO 639-2 standard',
            },
            language_name: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: 'Full name or label of the language',
            },
            direction: {
                type: DataTypes.STRING,
                allowNull: false,
                comment: 'Writing direction (ltr or rtl)',
            },
            flagImageUrl: {
                type: DataTypes.STRING,
                comment: 'URL of the flag image representing the language',
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                // foreignKey: true,
                // onDelete: "cascade",
                // references: {
                //     model: "User",
                //     key: "id",
                // },
            },
            lastUsedIp: {
                type: DataTypes.STRING,
                comment: 'User ip address ',
            }
        },
        {
            sequelize,
            modelName: 'Language',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Language, createLanguageModel
}