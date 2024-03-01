const { Model } = require('sequelize');
class SustainGoal extends Model {
}

const createSustainGoalModel = (sequelize, DataTypes) => {
    SustainGoal.init(
        //pass only needed field with datatype
        {
            value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sustaincode: {
                type: DataTypes.STRING,
                allowNull: true
            },
            lang_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                foreignKey: true,
                onDelete: "cascade",
                references: {
                    model: "Language",
                    key: "id",
                },
            },
            type: {
                type: DataTypes.STRING,
                allowNull: true
            },
            imgUrl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                foreignKey: true,
                onDelete: "cascade",
                references: {
                    model: "User",
                    key: "id",
                },
            },
            lastUsedIp: {
                type: DataTypes.STRING,
                allowNull: true,
            },

        },
        {
            sequelize,
            modelName: 'SustainGoal',
            freezeTableName: true,
        },
    )
};

module.exports = {
    SustainGoal, createSustainGoalModel
}