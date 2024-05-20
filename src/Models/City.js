const { Model } = require('sequelize');
class City extends Model {

}

const createCityModel = (sequelize, DataTypes) => {

    City.init(
        //pass only needed field with datatype
        {
            cityname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            regionid: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'City',
            freezeTableName: true,
        },
    )
};

module.exports = {
    City, createCityModel
}