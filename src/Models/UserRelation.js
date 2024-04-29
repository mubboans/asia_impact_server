const { Model } = require("sequelize");

const { Document } = require("./Document");
const { createModelInitObj } = require(".");

class UserRelation extends Model {
    static associate(models) {
        console.log(models, "models for associate");
    }
}

const createUserRelationModel = (sequelize, DataTypes) => {
    UserRelation.init(
        createModelInitObj(
            //pass only needed field with datatype
            {
                investorId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "User",
                        key: "id"
                    }
                },
                advisorId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "User",
                        key: "id"
                    }
                },
                relationshipType: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                    //0 - Advisor to Investor
                    //1 - Investor to Advisor
                },
                note: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: true
                },



                notification_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                requesterId: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                requestStatus: {
                    type: DataTypes.ENUM,
                    values: ["pending", "approved", "rejected"],
                    defaultValue: "pending"
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: "UserRelation",
            freezeTableName: true
        }
    );
};

module.exports = {
    UserRelation,
    createUserRelationModel
};
