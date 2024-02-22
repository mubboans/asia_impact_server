const { Model } = require('sequelize');

const { Document } = require('./Document');
const { createModelInitObj } = require('.');

class News extends Model {

    static associate(models) {
        console.log(models, 'models for associate');
    }

}

const createNewsModel = (sequelize, DataTypes) => {



    News.init(
        createModelInitObj( //pass only needed field with datatype
            {
                chip: {
                    type: DataTypes.ENUM,
                    values: ['Leading', 'Highlight', 'Latest', 'In Focus', 'Trending'],
                    allowNull: false,
                    defaultValue: 'Latest'
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                Newdate: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                targetUser: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                imgUrl: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                link: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            },
            DataTypes
        ),
        {
            sequelize,
            modelName: 'News',
            freezeTableName: true,
        },
    )
};

module.exports = {
    News, createNewsModel
}