
const { Model } = require('sequelize');
const { createModelInitObj } = require('.');

class Complaint extends Model {
}
const createComplaint = (sequelize, DataTypes) => {
    Complaint.init(
        createModelInitObj(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: "pending" // resolve,rejected
                },
                userid: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                officer_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                }
            }, DataTypes),
        {
            sequelize,
            modelName: 'Complaint',
            tableName: 'Complaint',
            freezeTableName: true
        }
    )
}

console.log('Documents exported');
module.exports = { Complaint, createComplaint };