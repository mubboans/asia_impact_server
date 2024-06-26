const { Model } = require('sequelize');


const { createModelInitObj } = require('.');

class Company extends Model {

}

const createCompanyModel = (sequelize, DataTypes) => {
    Company.init(
        createModelInitObj( //pass only needed field with datatype
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                lang_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    // foreignKey: true,
                    // onDelete: "cascade",
                    // references: {
                    //     model: "Language",
                    //     key: "id",
                    // },
                },
                companylogo: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                companycode: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                country: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                value: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: "DRs"
                },

                activerequest: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                ebita: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                turnover: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                // sustaingoalarchiveddesc: {
                //     type: DataTypes.TEXT,
                //     allowNull: true,
                // },
                // summarydesc: {
                //     type: DataTypes.TEXT,
                //     allowNull: true
                // },
                // summaryturnover: {
                //     type: DataTypes.STRING,
                //     allowNull: true
                // },
                // summarycustomerserved: {
                //     type: DataTypes.STRING,
                //     allowNull: true
                // },
                // summaryemployee: {
                //     type: DataTypes.STRING,
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
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'Company',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Company, createCompanyModel
}