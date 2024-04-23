const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class ActiveRequest extends Model {

}

const createActiveRequestModel = (sequelize, DataTypes) => {
    ActiveRequest.init(
        createModelInitObj( //pass only needed field with datatype
            {
                companyid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "Company",
                        key: "id",
                    },
                },
                userid: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    foreignKey: true,
                    onDelete: "cascade",
                    references: {
                        model: "User",
                        key: "id",
                    },
                },
                interestmessage: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                requestinitiatedby: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    // type of user initiated the request
                },
                lang_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'ActiveRequest',
            freezeTableName: true,
        },
    )
};

module.exports = {
    ActiveRequest, createActiveRequestModel
}