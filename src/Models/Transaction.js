
const { Model } = require('sequelize');
const { createModelInitObj } = require('.');

class Transaction extends Model {
}
const createTransaction = (sequelize, DataTypes) => {
    Transaction.init(
        createModelInitObj(
            {
                transact_date: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                buyer_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "User",
                        key: "id",
                    },
                },
                seller_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "User",
                        key: "id",
                    },
                },
                company_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "Company",
                        key: "id",
                    },
                },
                price: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                quantity: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: 'Completed'
                }
            }, DataTypes),
        {
            sequelize,
            modelName: 'Transaction',
            tableName: 'Transaction',
            freezeTableName: true
        }
    )
}
module.exports = { Transaction, createTransaction };