const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');
const { getCurrentFormatedDate } = require("../utils/functionalHelper");

class UserDetail extends Model {

}


const createUserDetail = (sequelize, DataTypes) => {
    UserDetail.init(
        {
            companyname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            companyincorporatedate: {
                type: DataTypes.STRING,
                allowNull: true
            },
            taxidentificationnumber: {
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
            traderegisterurl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            authorizedsignatureurl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            articleassociateurl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            financialstatementurl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            createdDate: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: getCurrentFormatedDate()
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
    UserDetail.beforeCreate(async (UserDetail, options) => {
        UserDetail.dataValues.password = bcrypt.hashSync(UserDetail.dataValues.email + UserDetail.dataValues.password, 10); //encrypt password
    });

}



// const UserDetails = (sequelize) => {
//     return sequelize.define('UserDetail', {
//         firstname: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//         lastname: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//         img: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true
//         },
//         countrycode: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//         contact: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true
//         },
//         role: {
//             type: DataTypes.STRING,
//             allowNull: true,
//             defaultValue: "UserDetail"
//         },
//         gender: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//         dateofbirth: {
//             type: DataTypes.DATE,
//             allowNull: true
//         },
//         documentId: {
//             type: DataTypes.STRING,
//             allowNull: true,
//         },
//         documentType: {
//             type: DataTypes.STRING,
//             allowNull: true,
//             comment: 'This is a column value may very with document'
//         },
//         linkDevice: {
//             type: DataTypes.STRING,
//             allowNull: true
//         }
//     }, {
//         freezeTableName: true
//     }
//     )
// }
// UserDetail.hasMany(Document);
console.log('UserDetail exported');
module.exports = { UserDetail, createUserDetail };