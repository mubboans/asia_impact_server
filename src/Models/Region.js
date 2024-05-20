const { Model } = require('sequelize');
class Region extends Model {

}

const createRegionModel = (sequelize, DataTypes) => {

    Region.init(
        //pass only needed field with datatype
        {
            regionname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            countryid: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Region',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Region, createRegionModel
}