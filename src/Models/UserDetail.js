const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');
const { getCurrentFormatedDate } = require("../utils/functionalHelper");

class UserDetail extends Model {

}


const createUserDetail = (sequelize, DataTypes) => {
    UserDetail.init(
        {
            userid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            img: {
                type: DataTypes.STRING,
                allowNull: true
            },
            residencecountry: {
                type: DataTypes.STRING,
                allowNull: true
            },
            country: {
                type: DataTypes.ENUM,
                values: ['india', 'indonesia', 'philippines'],
            },
            zipcode: {
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
            gender: {
                type: DataTypes.STRING,
                allowNull: true
            },
            dateofbirth: {
                type: DataTypes.DATE,
                allowNull: true
            },
            linkDevice: {
                type: DataTypes.STRING,
                allowNull: true
            },






            // companyname: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
            // companyincorporatedate: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
            // taxidentificationnumber: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
            // numberofubo: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
            // numberoflr: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
            // traderegisterurl: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
            // authorizedsignatureurl: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
            // articleassociateurl: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
            // financialstatementurl: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
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
            modelName: 'UserDetail',
            tableName: 'UserDetail',
            freezeTableName: true,

        },

    )
    // UserDetail.beforeCreate(async (UserDetail, options) => {
    //     UserDetail.dataValues.password = bcrypt.hashSync(UserDetail.dataValues.email + UserDetail.dataValues.password, 10); //encrypt password
    // });

}

module.exports = { UserDetail, createUserDetail };