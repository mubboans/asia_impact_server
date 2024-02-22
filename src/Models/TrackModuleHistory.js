const { Model } = require('sequelize');
const { getCurrentFormatedDate } = require('../utils/functionalHelper');
class ModuleHistory extends Model {

    // static associate(models) {
    //     console.log(models, 'models for associate');
    // }

}

const createModuleHistoryModel = (sequelize, DataTypes) => {



    ModuleHistory.init(

        {
            modulename: {
                type: DataTypes.STRING,
                allowNull: true
            },
            remark: {
                type: DataTypes.STRING,
                allowNull: true
            },
            deletedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                foreignKey: true,
                onDelete: "cascade",
                references: {
                    model: "User",
                    key: "id",
                },
            },
            deletionDate: {
                type: DataTypes.STRING,
                defaultValue: getCurrentFormatedDate()
            },
            lastUsedIp: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'ModuleHistory',
            freezeTableName: true,
        },
    )
};

module.exports = {
    ModuleHistory, createModuleHistoryModel
}