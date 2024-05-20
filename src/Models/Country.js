const { Model } = require('sequelize');
class Country extends Model {

}

const createCountryModel = (sequelize, DataTypes) => {

    Country.init(
        //pass only needed field with datatype
        {
            countryname: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: 'Country',
            freezeTableName: true,
        },
    )
};

module.exports = {
    Country, createCountryModel
}