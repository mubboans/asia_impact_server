const { Model } = require('sequelize');
const { createModelInitObj } = require('.');

class Otp extends Model {

}

const createOtpModel = (sequelize, DataTypes) => {

    Otp.init(
        //pass only needed field with datatype
        {
            contact: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            otp: {
                type: DataTypes.STRING,
                allowNull: true
            },
            validto: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true
            },
            type: {
                type: DataTypes.STRING,
                allowNull: true
            },
            verifyon: {
                type: DataTypes.STRING,
                allowNull: true
            },
            sendby: {
                type: DataTypes.STRING,
                allowNull: true
            },
            isUsed: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
                // Onlyy used in tha case of Forgot password after verfication
            }
        },
        {
            sequelize,
            modelName: 'Otp',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Otp, createOtpModel
}