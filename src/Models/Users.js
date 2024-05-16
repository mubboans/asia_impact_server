const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');
const { getCurrentFormatedDate } = require("../utils/functionalHelper");

class User extends Model {

}


const createUser = (sequelize, DataTypes) => {
    User.init(
        {
            // firstname: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
            // lastname: {
            //     type: DataTypes.STRING,
            //     allowNull: true
            // },
            password: {
                type: DataTypes.STRING,
                allowNull: true
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false,
                // unique: true
            },
            contact: {
                type: DataTypes.STRING,
                allowNull: true
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'pending' //declined,approved,document,document appproval pending,freeze
            },
            countrycode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            type: {
                type: DataTypes.ENUM,
                values: ['admin', 'user'],
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM,
                values: ['basic', 'individual_investor', 'advisor', 'legalrepresent', 'admin', 'editor', 'ai_officer'],
                // defaultValue: "explorer"
                allowNull: true
            },
            access_group: {
                type: DataTypes.ENUM,
                values: ['basic', 'intermediate', 'advanced'],
                allowNull: true,
                defaultValue: 'basic'
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            createdDate: {
                type: DataTypes.STRING,
                allowNull: true,
                // defaultValue: getCurrentFormatedDate()
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
            deletedBy: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            lastUsedIp: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lang_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            rejectionreason: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            deletereason: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            freezereason: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            pin: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'User',
            freezeTableName: true,

        }
    )
    User.beforeCreate(async (user, options) => {
        console.log(user.dataValues.password, 'user.dataValues.password set');
        if (user.dataValues.password) {
            user.dataValues.password = bcrypt.hashSync(user.dataValues.email + user.dataValues.password, 10)  //encrypt password 
        }
        console.log(user.dataValues.password, 'user.dataValues.password after');
    });

}
console.log('user exported');
module.exports = { User, createUser };