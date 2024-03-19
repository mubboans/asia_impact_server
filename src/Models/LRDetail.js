const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');
const { getCurrentFormatedDate } = require("../utils/functionalHelper");

class LrDetail extends Model {

}


const createLrDetail = (sequelize, DataTypes) => {
    LrDetail.init(
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
            companyname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            companyincorporatedate: {
                type: DataTypes.STRING,
                allowNull: true
            },
            taxnumber: {
                type: DataTypes.STRING,
                allowNull: true
            },
            numberofubo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            numberoflr: {
                type: DataTypes.STRING,
                allowNull: true
            },
            ubofirstname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            ubolastname: {
                type: DataTypes.STRING,
                allowNull: true
            },


            lrfirstname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lrlastname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            countrycode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            contact: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lrcountry: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lrzipcode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lrstate: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lrcity: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lrstreet: {
                type: DataTypes.STRING,
                allowNull: true
            },
            detailtype: {
                type: DataTypes.STRING,
                allowNull: true
                //Type of detail exp UBO-Detail,LR-Detail or Company-Detail 
            },
            createdDate: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lastUpdateDate: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: getCurrentFormatedDate()
            },
            deletionDate: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lastUsedIp: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lang_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: 'LrDetail',
            tableName: 'LrDetail',
            freezeTableName: true,

        },

    )
}

module.exports = { LrDetail, createLrDetail };