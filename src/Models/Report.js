const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class Report extends Model {

}

const createReportModel = (sequelize, DataTypes) => {
    Report.init(
        createModelInitObj( //pass only needed field with datatype
            {
                reporttype: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    // month-wise report e.g :- monthwise, quaterly and yearly
                },
                tag: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                fromDate: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                toDate: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
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
                lang_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                fileurl: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                filename: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                reportcode: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                // summarydesc: {
                //     type: DataTypes.TEXT,
                //     allowNull: true
                // },

                // impactdecs: {
                //     type: DataTypes.TEXT,
                //     allowNull: true
                // },
                // impactplasticcollect: {
                //     type: DataTypes.STRING,
                //     allowNull: true
                // },

                // impactplasticrecycle: {
                //     type: DataTypes.STRING,
                //     allowNull: true
                // },
                // impactvolumesold: {
                //     type: DataTypes.STRING,
                //     allowNull: true
                // },
                // impactpremiumsale: {
                //     type: DataTypes.STRING,
                //     allowNull: true
                // },
                // impactgranulesproduced: {
                //     type: DataTypes.STRING,
                //     allowNull: true
                // },
                targetUser: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                imgUrl: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                otherdetail: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                isNew: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true
                },
                tenure: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'Report',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Report, createReportModel
}