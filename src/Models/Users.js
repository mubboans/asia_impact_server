const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');
const { getCurrentFormatedDate } = require("../utils/functionalHelper");

class User extends Model {

    firstname;
    lastname;
    password;
    imgurl;
    email;
    contact;
    countrycode;
    role;
    gender;
    dateofbirth;
    linkDevice;
    createdDate;
    lastUpdateDate;
    deletionDate;
    lastUsedIp;
}


const createUser = (sequelize, DataTypes) => {
    User.init(
        {
            firstname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true
            },
            img: {
                type: DataTypes.STRING,
                allowNull: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            countrycode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            country: {
                type: DataTypes.ENUM,
                values: ['india', 'indonesia', 'philippines'],
            },
            contact: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            role: {
                type: DataTypes.ENUM,
                values: ['explorer', 'investor', 'advisor', 'legalrepresent', 'admin'],
                defaultValue: "explorer"
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true
            },
            dateofbirth: {
                type: DataTypes.DATE,
                allowNull: true
            },
            // documentId: {
            //     type: DataTypes.STRING,
            //     allowNull: true,
            // },
            // documentType: {
            //     type: DataTypes.STRING,
            //     allowNull: true,
            //     comment: 'This is a column value may very with document'
            // },
            linkDevice: {
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
                foreignKey: true,
                onDelete: "cascade",
                references: {
                    model: "Language",
                    key: "id",
                },
            }
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'User',
            freezeTableName: true
        }
    )
    User.beforeCreate(async (user, options) => {
        user.dataValues.password = bcrypt.hashSync(user.dataValues.email + user.dataValues.password, 10); //encrypt password
    });

}



// const Users = (sequelize) => {
//     return sequelize.define('User', {
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
//             defaultValue: "User"
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
// User.hasMany(Document);
console.log('user exported');
module.exports = { User, createUser };